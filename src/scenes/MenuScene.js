import Phaser from 'phaser';
import { GAME, COLORS, UI, PX, TRANSITION, VFX } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { ThielFace } from '../entities/ThielFace.js';
import { renderPixelArt } from '../core/PixelRenderer.js';
import { PALETTE } from '../sprites/palette.js';
import { OFFICE_BG } from '../sprites/backgrounds.js';
import { addMuteButton } from '../audio/MuteButton.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
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
    renderPixelArt(this, 'menu_office_bg', OFFICE_BG, PALETTE, bgPixelSize);
    const bgImage = this.add.image(cx, h / 2, 'menu_office_bg');
    bgImage.setDisplaySize(w, h);
    bgImage.setAlpha(0.2);

    // --- Subtle grid overlay for corporate feel ---
    const gridGfx = this.add.graphics();
    gridGfx.lineStyle(0.5 * PX, 0xffffff, 0.03);
    const gridSize = 40 * PX;
    for (let x = 0; x < w; x += gridSize) {
      gridGfx.moveTo(x, 0);
      gridGfx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += gridSize) {
      gridGfx.moveTo(0, y);
      gridGfx.lineTo(w, y);
    }
    gridGfx.strokePath();

    // --- Title: "THIEL FUNDED" ---
    // Use portrait-specific ratio when in portrait mode to prevent oversized title
    const titleRatio = isPortrait ? UI.TITLE_RATIO_PORTRAIT : UI.TITLE_RATIO;
    const titleSize = Math.round(h * titleRatio * 1.1);
    const maxTitleWidth = w * UI.TITLE_MAX_WIDTH_RATIO;
    const title = this.add.text(cx, h * 0.20, 'THIEL FUNDED', {
      fontSize: titleSize + 'px',
      fontFamily: UI.FONT,
      color: COLORS.GOLD,
      fontStyle: 'bold',
      shadow: { offsetX: 0, offsetY: 4, color: 'rgba(0,0,0,0.7)', blur: 12, fill: true },
      letterSpacing: 3,
      maxLines: 1,
    }).setOrigin(0.5);

    // Clamp title so it never overflows screen width
    if (title.width > maxTitleWidth) {
      title.setScale(maxTitleWidth / title.width);
    }

    // --- Subtitle ---
    const subRatio = isPortrait ? UI.SMALL_RATIO_PORTRAIT : UI.SMALL_RATIO;
    const subSize = Math.round(h * subRatio * 1.1);
    const subtitle = this.add.text(cx, h * 0.27, 'Can you convince Peter Thiel to fund your startup?', {
      fontSize: subSize + 'px',
      fontFamily: UI.FONT,
      color: COLORS.MUTED_TEXT,
      wordWrap: { width: w * 0.8 },
      align: 'center',
    }).setOrigin(0.5);

    // --- Animated Thiel Face ---
    const faceY = isPortrait ? h * 0.42 : h * 0.50;
    this.thielFace = new ThielFace(this, cx, faceY, isPortrait ? 0.85 : 1.0);

    // Idle expression cycling
    const expressions = ['thinking', 'neutral', 'thinking', 'impressed', 'thinking'];
    let expIndex = 0;
    this.expressionTimer = this.time.addEvent({
      delay: 2500,
      loop: true,
      callback: () => {
        expIndex = (expIndex + 1) % expressions.length;
        this.thielFace.setExpression(expressions[expIndex]);
      },
    });

    // --- "Zero to One" tagline ---
    const tagSize = Math.round(h * (isPortrait ? UI.SMALL_RATIO_PORTRAIT : UI.SMALL_RATIO) * 0.9);
    const tagline = this.add.text(cx, faceY + 85 * PX, '"Competition is for losers."', {
      fontSize: tagSize + 'px',
      fontFamily: UI.FONT,
      color: COLORS.MUTED_TEXT,
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // --- Start Pitch button ---
    const btnY = isPortrait ? h * 0.72 : h * 0.78;
    const startBtn = this.createButton(cx, btnY, 'START PITCH', () => this.startGame());

    // --- Hint ---
    const hintSize = Math.round(h * (isPortrait ? UI.SMALL_RATIO_PORTRAIT : UI.SMALL_RATIO) * 0.9);
    const hint = this.add.text(cx, btnY + 50 * PX, 'Press SPACE or tap to begin', {
      fontSize: hintSize + 'px',
      fontFamily: UI.FONT,
      color: COLORS.MUTED_TEXT,
    }).setOrigin(0.5);

    // --- Keyboard shortcut ---
    this.input.keyboard.once('keydown-SPACE', () => this.startGame());

    // --- Staggered entrance animations ---
    // Title slides down from top
    const titleFinalY = title.y;
    title.setY(-title.height);
    title.setAlpha(0);
    this.tweens.add({
      targets: title,
      y: titleFinalY,
      alpha: 1,
      duration: VFX.MENU_TITLE_SLIDE_DURATION,
      ease: 'Back.easeOut',
      onComplete: () => {
        // Start gentle float after landing
        this.tweens.add({
          targets: title,
          y: titleFinalY - 5 * PX,
          duration: 2500,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      },
    });

    // Subtitle fades in after title lands
    subtitle.setAlpha(0);
    this.tweens.add({
      targets: subtitle,
      alpha: 1,
      duration: VFX.MENU_SUBTITLE_FADE_DURATION,
      delay: VFX.MENU_TITLE_SLIDE_DURATION + VFX.MENU_STAGGER_OFFSET,
      ease: 'Quad.easeOut',
    });

    // Thiel face fades in
    this.thielFace.setAlpha(0);
    this.tweens.add({
      targets: this.thielFace.sprite,
      alpha: 1,
      duration: VFX.MENU_FACE_FADE_DURATION,
      delay: VFX.MENU_STAGGER_OFFSET * 2,
      ease: 'Quad.easeOut',
    });
    // Also fade the container
    this.tweens.add({
      targets: this.thielFace.container,
      alpha: 1,
      duration: VFX.MENU_FACE_FADE_DURATION,
      delay: VFX.MENU_STAGGER_OFFSET * 2,
      ease: 'Quad.easeOut',
    });

    // Tagline fades in with face
    tagline.setAlpha(0);
    this.tweens.add({
      targets: tagline,
      alpha: 1,
      duration: VFX.MENU_FACE_FADE_DURATION,
      delay: VFX.MENU_STAGGER_OFFSET * 3,
      ease: 'Quad.easeOut',
      onComplete: () => {
        // Start the pulsing after fade in
        this.tweens.add({
          targets: tagline,
          alpha: 0.4,
          duration: 2000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      },
    });

    // Button slides up from bottom
    const btnFinalY = startBtn.y;
    startBtn.setY(h + 50 * PX);
    startBtn.setAlpha(0);
    this.tweens.add({
      targets: startBtn,
      y: btnFinalY,
      alpha: 1,
      duration: VFX.MENU_BTN_SLIDE_DURATION,
      delay: VFX.MENU_STAGGER_OFFSET * 3,
      ease: 'Back.easeOut',
    });

    // Hint fades in last
    hint.setAlpha(0);
    this.tweens.add({
      targets: hint,
      alpha: 1,
      duration: 400,
      delay: VFX.MENU_STAGGER_OFFSET * 4,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: hint,
          alpha: 0.3,
          duration: 1200,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      },
    });

    // --- Mute toggle button ---
    addMuteButton(this);

    // --- Start menu BGM ---
    eventBus.emit(Events.MUSIC_MENU);

    // --- Fade in ---
    this.cameras.main.fadeIn(TRANSITION.FADE_DURATION, 0, 0, 0);
  }

  startGame() {
    if (this._transitioning) return;
    this._transitioning = true;

    eventBus.emit(Events.GAME_START);
    this.cameras.main.fadeOut(TRANSITION.FADE_DURATION, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      if (this.thielFace) {
        this.thielFace.destroy();
        this.thielFace = null;
      }
      if (this.expressionTimer) {
        this.expressionTimer.destroy();
      }
      this.scene.start('PitchScene');
      this.scene.launch('UIScene');
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

    // Background with subtle gradient
    const bg = this.add.graphics();
    this.fillBtnGradient(bg, btnW, btnH, radius, COLORS.BTN_PRIMARY);
    container.add(bg);

    // Label
    const fontSize = Math.round(GAME.HEIGHT * UI.BODY_RATIO);
    const text = this.add.text(0, 0, label, {
      fontSize: fontSize + 'px',
      fontFamily: UI.FONT,
      color: COLORS.BTN_TEXT,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    container.add(text);

    // Interactive hit area
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
    // Draw a subtle gradient by layering two fills
    const color = Phaser.Display.Color.IntegerToColor(baseColor);
    const lighterR = Math.min(255, color.red + 20);
    const lighterG = Math.min(255, color.green + 20);
    const lighterB = Math.min(255, color.blue + 20);
    const lighter = Phaser.Display.Color.GetColor(lighterR, lighterG, lighterB);

    // Base color
    gfx.fillStyle(baseColor, 1);
    gfx.fillRoundedRect(-w / 2, -h / 2, w, h, radius);

    // Lighter top half for gradient effect
    gfx.fillStyle(lighter, 0.4);
    gfx.fillRoundedRect(-w / 2, -h / 2, w, h / 2, { tl: radius, tr: radius, bl: 0, br: 0 });
  }
}
