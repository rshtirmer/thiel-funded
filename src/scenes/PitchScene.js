import Phaser from 'phaser';
import { GAME, COLORS, UI, PX, PITCH, TRANSITION, VFX } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { ThielFace } from '../entities/ThielFace.js';
import { FundingSystem } from '../systems/FundingSystem.js';
import { selectScenarios, shuffleAnswers } from '../data/PitchData.js';
import { renderPixelArt } from '../core/PixelRenderer.js';
import { PALETTE } from '../sprites/palette.js';
import { OFFICE_BG } from '../sprites/backgrounds.js';
import { AudioManager } from '../audio/AudioManager.js';

export class PitchScene extends Phaser.Scene {
  constructor() {
    super('PitchScene');
  }

  create() {
    gameState.reset();
    gameState.started = true;

    const w = GAME.WIDTH;
    const h = GAME.HEIGHT;
    const isPortrait = GAME.IS_PORTRAIT;

    this._transitioning = false;
    this._answering = false;
    this._currentAnswerButtons = [];
    this._typewriterTimer = null;
    this._cursorBlinkTimer = null;
    this._cursorText = null;
    this._isFirstRound = true;

    // --- Background ---
    this.drawGradient(w, h, COLORS.BG_TOP, COLORS.BG_BOTTOM);

    // --- Pixel art office background overlay ---
    this._generateBackgroundTexture();
    const bgImage = this.add.image(w / 2, h / 2, 'office_bg_tex');
    bgImage.setDisplaySize(w, h);
    bgImage.setAlpha(0.35);

    // --- Funding System ---
    this.fundingSystem = new FundingSystem();

    // --- Select scenarios ---
    gameState.scenarios = selectScenarios(PITCH.SCENARIOS_PER_GAME);

    // --- Layout calculations ---
    const faceX = isPortrait ? w * 0.5 : w * 0.78;
    const faceY = isPortrait ? h * 0.10 : h * 0.25;
    const faceScale = isPortrait ? 0.7 : 0.85;

    // --- Thiel Face ---
    this.thielFace = new ThielFace(this, faceX, faceY, faceScale);

    // --- Speech bubble area ---
    const bubbleX = isPortrait ? w * 0.5 : w * 0.35;
    const bubbleY = isPortrait ? h * 0.26 : h * 0.25;
    const bubbleW = isPortrait ? w * 0.85 : w * 0.52;
    const bubbleH = isPortrait ? h * 0.14 : h * 0.30;

    // Speech bubble background
    this.speechBubbleBg = this.add.graphics();
    this.drawSpeechBubble(this.speechBubbleBg, bubbleX, bubbleY, bubbleW, bubbleH, isPortrait);

    // Speech text
    const speechFontSize = Math.round(h * UI.SPEECH_FONT_RATIO);
    this.speechText = this.add.text(bubbleX, bubbleY, '', {
      fontSize: speechFontSize + 'px',
      fontFamily: UI.FONT,
      color: COLORS.THIEL_SPEECH,
      wordWrap: { width: bubbleW - 30 * PX },
      lineSpacing: 4 * PX,
    }).setOrigin(0.5);

    // Store bubble position for cursor placement
    this._bubbleX = bubbleX;
    this._bubbleY = bubbleY;
    this._bubbleW = bubbleW;

    // --- Answer area ---
    const answerStartY = isPortrait ? h * 0.48 : h * 0.56;
    this.answerStartY = answerStartY;
    this.answerAreaX = w * 0.5;

    // --- Answer buttons container ---
    this.answerContainer = this.add.container(0, 0);

    // --- Keyboard input for answer selection ---
    this.keyOne = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    this.keyTwo = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    this.keyThree = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);

    // --- Wipe overlay (used for round transitions) ---
    this._wipeBar = this.add.graphics();
    this._wipeBar.setDepth(100);

    // --- Fade in and start ---
    this.cameras.main.fadeIn(TRANSITION.FADE_DURATION, 0, 0, 0);

    eventBus.emit(Events.PITCH_START);

    // Start first round after a brief delay
    this.time.delayedCall(500, () => {
      this.startRound();
    });
  }

  startRound() {
    gameState.round++;
    const roundIndex = gameState.round - 1;

    if (roundIndex >= gameState.scenarios.length) {
      this.completePitch();
      return;
    }

    const scenario = gameState.scenarios[roundIndex];
    gameState.currentScenario = scenario;

    eventBus.emit(Events.PITCH_ROUND_START, { round: gameState.round, scenario });
    eventBus.emit(Events.THIEL_REACT, { expression: 'thinking' });

    // Clear previous answers
    this.answerContainer.removeAll(true);
    this._currentAnswerButtons = [];
    this._answering = false;

    // Round transition wipe (skip for first round)
    if (!this._isFirstRound) {
      this.playRoundWipe(() => {
        this.typewriterText(scenario.thielQuestion, () => {
          this.showAnswers(scenario);
        });
      });
    } else {
      this._isFirstRound = false;
      this.typewriterText(scenario.thielQuestion, () => {
        this.showAnswers(scenario);
      });
    }
  }

  /** Horizontal wipe transition between rounds. */
  playRoundWipe(onComplete) {
    const w = GAME.WIDTH;
    const h = GAME.HEIGHT;
    const bar = this._wipeBar;
    bar.clear();
    bar.fillStyle(0x0a0e1a, 0.95);
    bar.fillRect(0, 0, w, h);
    bar.setAlpha(1);
    bar.setX(-w);

    // Sweep right
    this.tweens.add({
      targets: bar,
      x: 0,
      duration: TRANSITION.WIPE_DURATION / 2,
      ease: 'Quad.easeIn',
      onComplete: () => {
        // At peak: content is hidden, set up new round content
        this.speechText.setText('');
        this._removeCursor();

        // Sweep out to the right
        this.tweens.add({
          targets: bar,
          x: w,
          duration: TRANSITION.WIPE_DURATION / 2,
          ease: 'Quad.easeOut',
          onComplete: () => {
            bar.setX(-w);
            if (onComplete) onComplete();
          },
        });
      },
    });
  }

  typewriterText(text, onComplete) {
    this.speechText.setText('');
    this._removeCursor();
    let index = 0;

    if (this._typewriterTimer) {
      this._typewriterTimer.destroy();
    }

    // Create blinking cursor
    const speechFontSize = Math.round(GAME.HEIGHT * UI.SPEECH_FONT_RATIO);
    this._cursorText = this.add.text(0, 0, '|', {
      fontSize: speechFontSize + 'px',
      fontFamily: UI.FONT,
      color: COLORS.THIEL_SPEECH,
    }).setOrigin(0, 0.5);
    this._cursorVisible = true;

    // Blink timer
    this._cursorBlinkTimer = this.time.addEvent({
      delay: VFX.CURSOR_BLINK_RATE,
      loop: true,
      callback: () => {
        if (this._cursorText) {
          this._cursorVisible = !this._cursorVisible;
          this._cursorText.setAlpha(this._cursorVisible ? 1 : 0);
        }
      },
    });

    this._typewriterTimer = this.time.addEvent({
      delay: PITCH.TYPEWRITER_SPEED,
      repeat: text.length - 1,
      callback: () => {
        index++;
        this.speechText.setText(text.substring(0, index));
        this._updateCursorPosition();

        // Play typewriter tick SFX (only every 3rd character to avoid overload)
        if (index % 3 === 0) {
          try { AudioManager.getInstance().playSFX('typewriter_tick'); } catch (_) { /* ignore */ }
        }

        if (index >= text.length) {
          // Typing complete: remove cursor after a brief moment
          this.time.delayedCall(300, () => {
            this._removeCursor();
          });
          if (onComplete) onComplete();
        }
      },
    });
  }

  /** Position the cursor just after the last character of the speech text. */
  _updateCursorPosition() {
    if (!this._cursorText || !this.speechText) return;
    const bounds = this.speechText.getBounds();
    // Place cursor at the right edge of the text, vertically centered on last line
    // For multi-line, approximate using the text bottom
    const lineHeight = this.speechText.style.fontSize
      ? parseInt(this.speechText.style.fontSize)
      : 20;
    const lastLineY = bounds.bottom - lineHeight / 2;

    // Determine right edge of last line of text
    this._cursorText.setPosition(bounds.right + 2 * PX, lastLineY);
  }

  /** Remove the blinking cursor and its timer. */
  _removeCursor() {
    if (this._cursorBlinkTimer) {
      this._cursorBlinkTimer.destroy();
      this._cursorBlinkTimer = null;
    }
    if (this._cursorText) {
      this._cursorText.destroy();
      this._cursorText = null;
    }
  }

  showAnswers(scenario) {
    const shuffled = shuffleAnswers(scenario.answers);
    const isPortrait = GAME.IS_PORTRAIT;
    const w = GAME.WIDTH;
    const h = GAME.HEIGHT;

    const btnW = Math.max(w * UI.ANSWER_BTN_W_RATIO, 280 * PX);
    const btnH = Math.max(h * UI.ANSWER_BTN_H_RATIO, UI.MIN_TOUCH);
    const gap = isPortrait ? 8 * PX : 10 * PX;
    const fontSize = Math.round(h * UI.ANSWER_FONT_RATIO);

    // Ensure answers fit on screen in portrait mode
    const totalAnswerHeight = 3 * btnH + 2 * gap;
    const maxBottom = h * 0.97;
    let startY = this.answerStartY;
    if (startY + totalAnswerHeight > maxBottom) {
      startY = maxBottom - totalAnswerHeight;
    }

    shuffled.forEach((answer, i) => {
      const btnY = startY + i * (btnH + gap);
      const btnX = this.answerAreaX;

      // Stagger animation delay
      const delay = i * PITCH.ANSWER_STAGGER_DELAY;

      const btn = this.createAnswerButton(
        btnX, btnY, btnW, btnH, fontSize,
        answer.text,
        answer,
        scenario,
        delay,
        i + 1, // badge number
      );
      this._currentAnswerButtons.push({ container: btn, answer });
    });

    this._answering = true;
  }

  createAnswerButton(x, y, w, h, fontSize, label, answer, scenario, delay, badgeNum) {
    const container = this.add.container(x, y);
    container.setAlpha(0);
    container.setScale(0.95);

    // Background with subtle gradient
    const bg = this.add.graphics();
    this._drawAnswerBgGradient(bg, w, h, COLORS.ANSWER_DEFAULT);
    container.add(bg);

    // Number badge circle on the left
    const badgeRadius = Math.max(GAME.HEIGHT * UI.BADGE_RADIUS_RATIO, 10 * PX);
    const badgeX = -w / 2 + badgeRadius + 10 * PX;
    const badgeGfx = this.add.graphics();
    badgeGfx.fillStyle(0xffffff, 0.12);
    badgeGfx.fillCircle(badgeX, 0, badgeRadius);
    badgeGfx.lineStyle(1 * PX, 0xffffff, 0.2);
    badgeGfx.strokeCircle(badgeX, 0, badgeRadius);
    container.add(badgeGfx);

    const badgeFontSize = Math.round(fontSize * 0.85);
    const badgeText = this.add.text(badgeX, 0, String(badgeNum), {
      fontSize: badgeFontSize + 'px',
      fontFamily: UI.FONT,
      color: COLORS.GOLD,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    container.add(badgeText);

    // Text (shifted right to make room for badge)
    const textOffsetX = badgeRadius + 16 * PX;
    const textAvailW = w - textOffsetX - 24 * PX;
    const text = this.add.text(textOffsetX / 2, 0, label, {
      fontSize: fontSize + 'px',
      fontFamily: UI.FONT,
      color: COLORS.UI_TEXT,
      wordWrap: { width: textAvailW },
      align: 'left',
      lineSpacing: 2 * PX,
    }).setOrigin(0.5);
    container.add(text);

    // Interaction
    container.setSize(w, h);
    container.setInteractive({ useHandCursor: true });

    container.on('pointerover', () => {
      if (this._answering) {
        this._drawAnswerBgGradient(bg, w, h, COLORS.ANSWER_HOVER);
        this.tweens.add({ targets: container, scaleX: 1.02, scaleY: 1.02, duration: 60 });
        try { AudioManager.getInstance().playSFX('button_hover'); } catch (_) { /* ignore */ }
      }
    });

    container.on('pointerout', () => {
      if (this._answering) {
        this._drawAnswerBgGradient(bg, w, h, COLORS.ANSWER_DEFAULT);
        this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 60 });
      }
    });

    container.on('pointerdown', () => {
      if (this._answering) {
        container.setScale(0.97);
      }
    });

    container.on('pointerup', () => {
      if (this._answering) {
        container.setScale(1);
        this.selectAnswer(answer, scenario, container, bg, w, h);
      }
    });

    // Store refs for keyboard selection
    container._answer = answer;
    container._scenario = scenario;
    container._bg = bg;
    container._btnW = w;
    container._btnH = h;

    this.answerContainer.add(container);

    // Stagger entrance animation
    this.tweens.add({
      targets: container,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 250,
      delay: delay,
      ease: 'Back.easeOut',
    });

    return container;
  }

  /** Draw answer button background with a subtle vertical gradient. */
  _drawAnswerBgGradient(gfx, w, h, baseColor) {
    gfx.clear();
    // Base fill
    gfx.fillStyle(baseColor, 1);
    gfx.fillRoundedRect(-w / 2, -h / 2, w, h, UI.BTN_RADIUS);
    // Lighter top portion for gradient effect
    const color = Phaser.Display.Color.IntegerToColor(baseColor);
    const lighterR = Math.min(255, color.red + 15);
    const lighterG = Math.min(255, color.green + 15);
    const lighterB = Math.min(255, color.blue + 15);
    const lighter = Phaser.Display.Color.GetColor(lighterR, lighterG, lighterB);
    gfx.fillStyle(lighter, 0.35);
    gfx.fillRoundedRect(-w / 2, -h / 2, w, h / 2, { tl: UI.BTN_RADIUS, tr: UI.BTN_RADIUS, bl: 0, br: 0 });
    // Border
    gfx.lineStyle(1.5 * PX, 0x3a4060, 0.6);
    gfx.strokeRoundedRect(-w / 2, -h / 2, w, h, UI.BTN_RADIUS);
  }

  selectAnswer(answer, scenario, selectedContainer, selectedBg, btnW, btnH) {
    if (!this._answering) return;
    this._answering = false;

    eventBus.emit(Events.ANSWER_SELECTED, { answer, scenario });

    // Highlight selected answer
    const tierColor = answer.tier === 'great' ? COLORS.ANSWER_GREAT :
                      answer.tier === 'ok' ? COLORS.ANSWER_OK :
                      COLORS.ANSWER_BAD;

    this._drawAnswerBgGradient(selectedBg, btnW, btnH, tierColor);

    // --- Tier-specific visual effects ---
    if (answer.tier === 'bad') {
      // Screen shake on bad answer
      this.cameras.main.shake(VFX.SHAKE_DURATION, VFX.SHAKE_INTENSITY);
    } else if (answer.tier === 'great') {
      // Gold flash on great answer
      this.cameras.main.flash(VFX.FLASH_DURATION, VFX.FLASH_R, VFX.FLASH_G, VFX.FLASH_B, true);
      // Money rain
      this._spawnMoneyRain();
    }

    // Fade out other answers
    this._currentAnswerButtons.forEach(({ container }) => {
      if (container !== selectedContainer) {
        this.tweens.add({
          targets: container,
          alpha: 0.25,
          duration: 300,
          ease: 'Quad.easeOut',
        });
      }
    });

    // Flash selected
    this.tweens.add({
      targets: selectedContainer,
      scaleX: 1.03,
      scaleY: 1.03,
      duration: 150,
      yoyo: true,
      ease: 'Quad.easeOut',
    });

    // Emit result after brief delay to show selection
    this.time.delayedCall(400, () => {
      // Show Thiel's reaction
      eventBus.emit(Events.THIEL_REACT, { expression: answer.reaction });

      // Show Thiel's response
      this.typewriterText(answer.thielResponse, () => {});

      // Emit funding result
      eventBus.emit(Events.ANSWER_RESULT, {
        funding: answer.funding,
        tier: answer.tier,
        scenarioId: scenario.id,
        round: gameState.round,
      });

      // Show funding change floating text
      this.showFundingChange(answer.funding);

      // Move to next round after pause
      this.time.delayedCall(PITCH.PAUSE_BETWEEN_ROUNDS + 800, () => {
        if (gameState.round >= PITCH.TOTAL_ROUNDS) {
          this.completePitch();
        } else {
          this.startRound();
        }
      });
    });
  }

  /** Spawn "$" text objects that float down from the top with horizontal sway. */
  _spawnMoneyRain() {
    const w = GAME.WIDTH;
    const fontSize = Math.round(GAME.HEIGHT * VFX.MONEY_RAIN_FONT_RATIO);
    const symbols = ['$', '$$', '$$$', '$'];

    for (let i = 0; i < VFX.MONEY_RAIN_COUNT; i++) {
      const startX = Phaser.Math.Between(w * 0.1, w * 0.9);
      const startY = -fontSize;
      const symbol = symbols[i % symbols.length];

      const moneyText = this.add.text(startX, startY, symbol, {
        fontSize: fontSize + 'px',
        fontFamily: UI.FONT,
        color: COLORS.GOLD,
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2 * PX,
      }).setOrigin(0.5).setDepth(50);

      // Slight random alpha
      moneyText.setAlpha(Phaser.Math.FloatBetween(0.6, 1.0));

      // Float down with sway
      const targetY = GAME.HEIGHT + fontSize;
      const sway = VFX.MONEY_RAIN_SWAY * PX;
      const duration = VFX.MONEY_RAIN_DURATION + Phaser.Math.Between(-300, 300);
      const delayMs = Phaser.Math.Between(0, 400);

      // Vertical descent
      this.tweens.add({
        targets: moneyText,
        y: targetY,
        duration: duration,
        delay: delayMs,
        ease: 'Quad.easeIn',
        onComplete: () => moneyText.destroy(),
      });

      // Horizontal sway (sine-like back and forth)
      this.tweens.add({
        targets: moneyText,
        x: startX + Phaser.Math.Between(-sway, sway),
        duration: duration / 3,
        delay: delayMs,
        yoyo: true,
        repeat: 2,
        ease: 'Sine.easeInOut',
      });

      // Gentle rotation
      this.tweens.add({
        targets: moneyText,
        angle: Phaser.Math.Between(-30, 30),
        duration: duration,
        delay: delayMs,
        ease: 'Sine.easeInOut',
      });
    }
  }

  showFundingChange(amount) {
    const isPositive = amount >= 0;
    const text = isPositive ? `+$${amount}M` : `-$${Math.abs(amount)}M`;
    const color = isPositive ? COLORS.MONEY_GREEN : COLORS.MONEY_RED;
    const fontSize = Math.round(GAME.HEIGHT * UI.FUNDING_DISPLAY_RATIO);

    const floatingText = this.add.text(
      GAME.WIDTH * 0.5,
      GAME.IS_PORTRAIT ? GAME.HEIGHT * 0.42 : GAME.HEIGHT * 0.48,
      text,
      {
        fontSize: fontSize + 'px',
        fontFamily: UI.FONT,
        color: color,
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3 * PX,
      }
    ).setOrigin(0.5);

    // Float up and fade out
    this.tweens.add({
      targets: floatingText,
      y: floatingText.y - 60 * PX,
      alpha: 0,
      duration: 1200,
      ease: 'Quad.easeOut',
      onComplete: () => floatingText.destroy(),
    });

    // Scale pop
    floatingText.setScale(0.5);
    this.tweens.add({
      targets: floatingText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 200,
      yoyo: true,
      ease: 'Back.easeOut',
    });
  }

  completePitch() {
    if (this._transitioning) return;
    this._transitioning = true;

    gameState.pitchComplete = true;
    gameState.gameOver = true;

    eventBus.emit(Events.PITCH_COMPLETE, {
      funding: gameState.funding,
      answers: gameState.answers,
    });

    this.time.delayedCall(500, () => {
      eventBus.emit(Events.GAME_OVER, { funding: gameState.funding });
      this.cameras.main.fadeOut(TRANSITION.FADE_DURATION, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.stop('UIScene');
        this.scene.start('GameOverScene');
      });
    });
  }

  update() {
    // Keyboard answer selection
    if (this._answering && this._currentAnswerButtons.length === 3) {
      if (Phaser.Input.Keyboard.JustDown(this.keyOne)) {
        this.selectAnswerByIndex(0);
      } else if (Phaser.Input.Keyboard.JustDown(this.keyTwo)) {
        this.selectAnswerByIndex(1);
      } else if (Phaser.Input.Keyboard.JustDown(this.keyThree)) {
        this.selectAnswerByIndex(2);
      }
    }
  }

  selectAnswerByIndex(index) {
    if (!this._answering || index >= this._currentAnswerButtons.length) return;
    const { container } = this._currentAnswerButtons[index];
    this.selectAnswer(
      container._answer,
      container._scenario,
      container,
      container._bg,
      container._btnW,
      container._btnH,
    );
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

  _generateBackgroundTexture() {
    // Calculate pixel size so the 64-wide background fills the game width
    const bgPixelSize = Math.max(1, Math.ceil(GAME.WIDTH / 64));
    renderPixelArt(this, 'office_bg_tex', OFFICE_BG, PALETTE, bgPixelSize);
  }

  drawSpeechBubble(gfx, x, y, w, h, isPortrait) {
    gfx.fillStyle(COLORS.BUBBLE_BG, 0.9);
    gfx.fillRoundedRect(x - w / 2, y - h / 2, w, h, 12 * PX);
    gfx.lineStyle(1.5 * PX, COLORS.BUBBLE_BORDER, 0.8);
    gfx.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 12 * PX);

    // Small triangle pointing toward Thiel face
    if (!isPortrait) {
      const triX = x + w / 2;
      const triY = y - 10 * PX;
      gfx.fillStyle(COLORS.BUBBLE_BG, 0.9);
      gfx.fillTriangle(triX, triY, triX + 15 * PX, triY - 10 * PX, triX, triY + 15 * PX);
    } else {
      const triX = x;
      const triY = y - h / 2;
      gfx.fillStyle(COLORS.BUBBLE_BG, 0.9);
      gfx.fillTriangle(triX - 10 * PX, triY, triX, triY - 12 * PX, triX + 10 * PX, triY);
    }
  }

  shutdown() {
    if (this.fundingSystem) {
      this.fundingSystem.destroy();
    }
    if (this.thielFace) {
      this.thielFace.destroy();
    }
    if (this._typewriterTimer) {
      this._typewriterTimer.destroy();
    }
    this._removeCursor();
  }
}
