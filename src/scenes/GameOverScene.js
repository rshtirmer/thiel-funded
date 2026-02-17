import Phaser from 'phaser';
import { GAME, COLORS, UI, PX, TRANSITION, VERDICTS, VFX } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { ThielFace } from '../entities/ThielFace.js';
import { renderPixelArt } from '../core/PixelRenderer.js';
import { PALETTE } from '../sprites/palette.js';
import { OFFICE_BG } from '../sprites/backgrounds.js';
import { addMuteButton } from '../audio/MuteButton.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create() {
    const w = GAME.WIDTH;
    const h = GAME.HEIGHT;
    const cx = w / 2;
    const isPortrait = GAME.IS_PORTRAIT;

    this._transitioning = false;
    this.thielFace = null;

    // --- Gradient background ---
    this.drawGradient(w, h, COLORS.BG_TOP, COLORS.BG_BOTTOM);

    // --- Pixel art office background overlay ---
    const bgPixelSize = Math.max(1, Math.ceil(w / 64));
    renderPixelArt(this, 'gameover_office_bg', OFFICE_BG, PALETTE, bgPixelSize);
    const bgImage = this.add.image(cx, h / 2, 'gameover_office_bg');
    bgImage.setDisplaySize(w, h);
    bgImage.setAlpha(0.2);

    // --- Determine verdict ---
    const funding = gameState.funding;
    const verdict = VERDICTS.find(v => funding >= v.min && funding <= v.max) || VERDICTS[0];

    // --- Verdict title ---
    const titleRatio = isPortrait ? UI.TITLE_RATIO_PORTRAIT : UI.TITLE_RATIO;
    const titleSize = Math.round(h * titleRatio);
    const maxTitleWidth = w * UI.TITLE_MAX_WIDTH_RATIO;
    const verdictTitle = this.add.text(cx, h * 0.10, verdict.title, {
      fontSize: titleSize + 'px',
      fontFamily: UI.FONT,
      color: verdict.color,
      fontStyle: 'bold',
      shadow: { offsetX: 0, offsetY: 3, color: 'rgba(0,0,0,0.7)', blur: 10, fill: true },
    }).setOrigin(0.5);

    // Clamp verdict title width
    if (verdictTitle.width > maxTitleWidth) {
      verdictTitle.setScale(maxTitleWidth / verdictTitle.width);
    }

    // Scale-in animation
    verdictTitle.setScale(0);
    this.tweens.add({
      targets: verdictTitle,
      scaleX: 1,
      scaleY: 1,
      duration: 600,
      ease: 'Back.easeOut',
    });

    // --- Thiel Face with final expression ---
    const faceY = isPortrait ? h * 0.21 : h * 0.28;
    const faceScale = isPortrait ? 0.6 : 0.7;
    this.thielFace = new ThielFace(this, cx, faceY, faceScale);
    this.thielFace.setExpression(verdict.expression, false);

    // --- Slow zoom-in on Thiel's face during verdict reveal ---
    const sprite = this.thielFace.sprite;
    const startScale = sprite.scaleX;
    const endScale = startScale * VFX.VERDICT_ZOOM_SCALE;
    this.tweens.add({
      targets: sprite,
      scaleX: endScale,
      scaleY: endScale,
      duration: VFX.VERDICT_ZOOM_DURATION,
      ease: 'Sine.easeInOut',
    });

    // --- Thiel Quote ---
    const quoteSize = Math.round(h * (isPortrait ? UI.SMALL_RATIO_PORTRAIT : UI.SMALL_RATIO));
    const quoteY = isPortrait ? h * 0.31 : h * 0.44;
    const quoteText = this.add.text(cx, quoteY, verdict.quote, {
      fontSize: quoteSize + 'px',
      fontFamily: UI.FONT,
      color: COLORS.MUTED_TEXT,
      fontStyle: 'italic',
      wordWrap: { width: w * 0.8 },
      align: 'center',
    }).setOrigin(0.5);

    // --- Funding amount (animated counter with acceleration) ---
    const fundingLabelSize = Math.round(h * (isPortrait ? UI.SMALL_RATIO_PORTRAIT : UI.SMALL_RATIO));
    const fundingY = isPortrait ? h * 0.37 : h * 0.52;

    this.add.text(cx, fundingY, 'TOTAL FUNDING SECURED', {
      fontSize: fundingLabelSize + 'px',
      fontFamily: UI.FONT,
      color: COLORS.MUTED_TEXT,
      letterSpacing: 2,
    }).setOrigin(0.5);

    const fundingFontRatio = isPortrait ? UI.HEADING_RATIO_PORTRAIT : UI.HEADING_RATIO;
    const fundingSize = Math.round(h * fundingFontRatio * 1.4);
    const fundingColor = funding <= 0 ? COLORS.MONEY_RED : COLORS.MONEY_GREEN;
    const fundingText = this.add.text(cx, fundingY + 35 * PX, '$0M', {
      fontSize: fundingSize + 'px',
      fontFamily: UI.FONT,
      color: fundingColor,
      fontStyle: 'bold',
      shadow: { offsetX: 0, offsetY: 2, color: 'rgba(0,0,0,0.5)', blur: 6, fill: true },
    }).setOrigin(0.5);

    // Animated counter that accelerates toward the end
    // We use a custom easing that starts slow and speeds up at the end
    const counterTarget = { val: 0 };
    this.tweens.add({
      targets: counterTarget,
      val: funding,
      duration: VFX.COUNTER_DURATION,
      delay: 400,
      // Custom ease: slow start, fast at end (exponential ease-in)
      ease: 'Cubic.easeIn',
      onUpdate: () => {
        const current = Math.round(counterTarget.val);
        fundingText.setText(`$${current}M`);
      },
    });

    // --- Round breakdown ---
    const breakdownY = isPortrait ? h * 0.46 : h * 0.64;
    const breakdownSize = Math.round(h * (isPortrait ? UI.SMALL_RATIO_PORTRAIT : UI.SMALL_RATIO) * 0.85);
    const panelW = isPortrait ? w * 0.85 : w * 0.55;
    const rowH = isPortrait ? 20 * PX : 22 * PX;
    const panelH = rowH * gameState.answers.length + 20 * PX;

    // Ensure panel fits on screen
    const maxPanelBottom = isPortrait ? h * 0.78 : h * 0.84;
    let adjustedBreakdownY = breakdownY;
    if (adjustedBreakdownY + panelH > maxPanelBottom) {
      adjustedBreakdownY = maxPanelBottom - panelH;
    }

    // Panel background
    const panel = this.add.graphics();
    panel.fillStyle(0x000000, 0.3);
    panel.fillRoundedRect(cx - panelW / 2, adjustedBreakdownY - 10 * PX, panelW, panelH, 8 * PX);

    gameState.answers.forEach((answer, i) => {
      const y = adjustedBreakdownY + i * rowH + 4 * PX;

      // Round label
      this.add.text(cx - panelW / 2 + 12 * PX, y, `R${answer.round}`, {
        fontSize: breakdownSize + 'px',
        fontFamily: UI.FONT,
        color: COLORS.MUTED_TEXT,
      });

      // Tier indicator
      const tierColor = answer.tier === 'great' ? COLORS.MONEY_GREEN :
                        answer.tier === 'ok' ? COLORS.GOLD :
                        COLORS.MONEY_RED;

      const tierLabel = answer.tier === 'great' ? 'GREAT' :
                        answer.tier === 'ok' ? 'OK' : 'BAD';

      this.add.text(cx - panelW / 2 + 50 * PX, y, tierLabel, {
        fontSize: breakdownSize + 'px',
        fontFamily: UI.FONT,
        color: tierColor,
        fontStyle: 'bold',
      });

      // Funding change
      const fundingChange = answer.funding >= 0 ? `+$${answer.funding}M` : `-$${Math.abs(answer.funding)}M`;
      this.add.text(cx + panelW / 2 - 12 * PX, y, fundingChange, {
        fontSize: breakdownSize + 'px',
        fontFamily: UI.FONT,
        color: answer.funding >= 0 ? COLORS.MONEY_GREEN : COLORS.MONEY_RED,
        fontStyle: 'bold',
      }).setOrigin(1, 0);
    });

    // --- Best funding ---
    const bestY = adjustedBreakdownY + panelH + 12 * PX;
    const bestSize = Math.round(h * (isPortrait ? UI.SMALL_RATIO_PORTRAIT : UI.SMALL_RATIO) * 0.85);
    this.add.text(cx, bestY, `Best: $${gameState.bestFunding}M`, {
      fontSize: bestSize + 'px',
      fontFamily: UI.FONT,
      color: COLORS.MUTED_TEXT,
    }).setOrigin(0.5);

    // --- Pitch Again button ---
    const btnY = isPortrait ? Math.min(h * 0.85, bestY + 40 * PX) : h * 0.88;
    this.createButton(cx, btnY, 'PITCH AGAIN', () => this.restartGame());

    // --- Keyboard shortcut ---
    this.input.keyboard.once('keydown-SPACE', () => this.restartGame());

    // --- Confetti for FOUNDERS FUND verdict ---
    if (verdict.title === 'FOUNDERS FUND') {
      this._spawnConfetti();
    }

    // --- Mute toggle button ---
    addMuteButton(this);

    // --- Fade in ---
    this.cameras.main.fadeIn(TRANSITION.FADE_DURATION, 0, 0, 0);
  }

  /** Spawn colorful confetti text pieces that float down. */
  _spawnConfetti() {
    const w = GAME.WIDTH;
    const h = GAME.HEIGHT;
    const confettiChars = ['\u2588', '\u25CF', '\u2666', '\u2605', '$'];
    const colors = VFX.CONFETTI_COLORS;
    const fontSize = Math.round(h * 0.025);

    for (let i = 0; i < VFX.CONFETTI_COUNT; i++) {
      const startX = Phaser.Math.Between(0, w);
      const startY = Phaser.Math.Between(-h * 0.3, -20);
      const char = confettiChars[i % confettiChars.length];
      const color = colors[i % colors.length];

      const confetti = this.add.text(startX, startY, char, {
        fontSize: fontSize + 'px',
        fontFamily: UI.FONT,
        color: color,
      }).setOrigin(0.5).setDepth(60);

      confetti.setAlpha(Phaser.Math.FloatBetween(0.5, 1.0));
      confetti.setAngle(Phaser.Math.Between(0, 360));

      const targetY = h + 50;
      const duration = VFX.CONFETTI_DURATION + Phaser.Math.Between(-500, 500);
      const delayMs = Phaser.Math.Between(0, 800);

      // Float down
      this.tweens.add({
        targets: confetti,
        y: targetY,
        duration: duration,
        delay: delayMs,
        ease: 'Quad.easeIn',
        onComplete: () => confetti.destroy(),
      });

      // Horizontal sway
      this.tweens.add({
        targets: confetti,
        x: startX + Phaser.Math.Between(-80 * PX, 80 * PX),
        duration: duration / 2,
        delay: delayMs,
        yoyo: true,
        repeat: 1,
        ease: 'Sine.easeInOut',
      });

      // Spin
      this.tweens.add({
        targets: confetti,
        angle: confetti.angle + Phaser.Math.Between(180, 720),
        duration: duration,
        delay: delayMs,
        ease: 'Linear',
      });
    }
  }

  restartGame() {
    if (this._transitioning) return;
    this._transitioning = true;

    eventBus.emit(Events.GAME_RESTART);
    this.cameras.main.fadeOut(TRANSITION.FADE_DURATION, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      if (this.thielFace) {
        this.thielFace.destroy();
        this.thielFace = null;
      }
      this.scene.start('MenuScene');
    });
  }

  // --- Helpers ---

  drawGradient(w, h, topColor, bottomColor) {
    const bg = this.add.graphics();
    const top = Phaser.Display.Color.IntegerToColor(topColor);
    const bot = Phaser.Display.Color.IntegerToColor(bottomColor);
    const steps = 64;
    const bandH = Math.ceil(h / steps);

    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const r = Math.round(top.red + (bot.red - top.red) * t);
      const g = Math.round(top.green + (bot.green - top.green) * t);
      const b = Math.round(top.blue + (bot.blue - top.blue) * t);
      bg.fillStyle(Phaser.Display.Color.GetColor(r, g, b));
      bg.fillRect(0, i * bandH, w, bandH + 1);
    }
  }

  createButton(x, y, label, callback) {
    const btnW = Math.max(GAME.WIDTH * UI.BTN_W_RATIO, 160);
    const btnH = Math.max(GAME.HEIGHT * UI.BTN_H_RATIO, UI.MIN_TOUCH);
    const radius = UI.BTN_RADIUS;

    const container = this.add.container(x, y);

    const bg = this.add.graphics();
    this.fillBtnGradient(bg, btnW, btnH, radius, COLORS.BTN_PRIMARY);
    container.add(bg);

    const fontSize = Math.round(GAME.HEIGHT * UI.BODY_RATIO);
    const text = this.add.text(0, 0, label, {
      fontSize: fontSize + 'px',
      fontFamily: UI.FONT,
      color: COLORS.BTN_TEXT,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    container.add(text);

    container.setSize(btnW, btnH);
    container.setInteractive({ useHandCursor: true });

    container.on('pointerover', () => {
      this.fillBtnGradient(bg, btnW, btnH, radius, COLORS.BTN_PRIMARY_HOVER);
      this.tweens.add({ targets: container, scaleX: 1.05, scaleY: 1.05, duration: 80 });
    });

    container.on('pointerout', () => {
      this.fillBtnGradient(bg, btnW, btnH, radius, COLORS.BTN_PRIMARY);
      this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 80 });
    });

    container.on('pointerdown', () => {
      this.fillBtnGradient(bg, btnW, btnH, radius, COLORS.BTN_PRIMARY_PRESS);
      container.setScale(0.95);
    });

    container.on('pointerup', () => {
      container.setScale(1);
      callback();
    });

    return container;
  }

  fillBtnGradient(gfx, w, h, radius, baseColor) {
    gfx.clear();
    const color = Phaser.Display.Color.IntegerToColor(baseColor);
    const lighterR = Math.min(255, color.red + 20);
    const lighterG = Math.min(255, color.green + 20);
    const lighterB = Math.min(255, color.blue + 20);
    const lighter = Phaser.Display.Color.GetColor(lighterR, lighterG, lighterB);

    gfx.fillStyle(baseColor, 1);
    gfx.fillRoundedRect(-w / 2, -h / 2, w, h, radius);

    gfx.fillStyle(lighter, 0.4);
    gfx.fillRoundedRect(-w / 2, -h / 2, w, h / 2, { tl: radius, tr: radius, bl: 0, br: 0 });
  }
}
