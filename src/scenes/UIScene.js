import Phaser from 'phaser';
import { GAME, COLORS, UI, PX, TRANSITION, VFX } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';
import { addMuteButton } from '../audio/MuteButton.js';

export class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
  }

  create() {
    const padding = GAME.WIDTH * 0.03;
    const scoreSize = Math.round(GAME.HEIGHT * UI.SCORE_SIZE_RATIO);
    const smallSize = Math.round(GAME.HEIGHT * UI.SMALL_RATIO);

    // --- Persistent funding glow (green-tinted, hidden initially) ---
    this.fundingGlow = this.add.graphics();
    this.fundingGlow.fillStyle(COLORS.MONEY_GREEN_HEX, VFX.FUNDING_GLOW_ALPHA);
    this.fundingGlow.fillRoundedRect(
      GAME.WIDTH * 0.005,
      GAME.HEIGHT * 0.002,
      GAME.WIDTH * 0.26,
      GAME.HEIGHT * 0.085,
      10 * PX,
    );
    this.fundingGlow.setAlpha(0);

    // --- Funding display (top-left) ---
    const fundingLabel = this.add.text(padding, padding, 'FUNDING', {
      fontSize: Math.round(smallSize * 0.8) + 'px',
      fontFamily: UI.FONT,
      color: COLORS.MUTED_TEXT,
      letterSpacing: 2,
    });

    this.fundingText = this.add.text(padding, padding + smallSize, '$0M', {
      fontSize: scoreSize + 'px',
      fontFamily: UI.FONT,
      color: COLORS.MONEY_GREEN,
      fontStyle: 'bold',
      stroke: COLORS.UI_SHADOW,
      strokeThickness: UI.SCORE_STROKE,
    });

    // --- Round display (top-right) ---
    this.roundText = this.add.text(
      GAME.WIDTH - padding,
      padding,
      `Round 1/${gameState.totalRounds}`,
      {
        fontSize: smallSize + 'px',
        fontFamily: UI.FONT,
        color: COLORS.MUTED_TEXT,
        fontStyle: 'bold',
      }
    ).setOrigin(1, 0);

    // --- Glow pulse tween (paused initially) ---
    this._glowPulseTween = this.tweens.add({
      targets: this.fundingGlow,
      alpha: { from: VFX.FUNDING_GLOW_ALPHA * 0.4, to: VFX.FUNDING_GLOW_ALPHA },
      duration: VFX.FUNDING_GLOW_PULSE_DURATION,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      paused: true,
    });

    // --- Event listeners ---
    this.onFundingChanged = ({ funding, change }) => {
      this.fundingText.setText(`$${funding}M`);

      // Color based on amount
      if (funding <= 0) {
        this.fundingText.setColor(COLORS.MONEY_RED);
        // Hide glow when funding is zero or negative
        this.fundingGlow.setAlpha(0);
        this._glowPulseTween.pause();
      } else {
        this.fundingText.setColor(COLORS.MONEY_GREEN);
        // Show persistent glow when funding is positive
        if (!this._glowPulseTween.isPlaying()) {
          this.fundingGlow.setAlpha(VFX.FUNDING_GLOW_ALPHA);
          this._glowPulseTween.resume();
        }
      }

      // Pop animation
      this.tweens.add({
        targets: this.fundingText,
        scaleX: TRANSITION.SCORE_POP_SCALE,
        scaleY: TRANSITION.SCORE_POP_SCALE,
        duration: TRANSITION.SCORE_POP_DURATION,
        yoyo: true,
        ease: 'Quad.easeOut',
      });

      // Glow effect (transient flash on change)
      if (change > 0) {
        this.flashFunding(COLORS.MONEY_GREEN_HEX);
      } else if (change < 0) {
        this.flashFunding(COLORS.MONEY_RED_HEX);
      }
    };

    this.onRoundStart = ({ round }) => {
      this.roundText.setText(`Round ${round}/${gameState.totalRounds}`);

      // Subtle pop for round change
      this.tweens.add({
        targets: this.roundText,
        scaleX: 1.15,
        scaleY: 1.15,
        duration: 120,
        yoyo: true,
        ease: 'Quad.easeOut',
      });
    };

    eventBus.on(Events.FUNDING_CHANGED, this.onFundingChanged);
    eventBus.on(Events.PITCH_ROUND_START, this.onRoundStart);

    // --- Mute toggle button ---
    addMuteButton(this);

    this.events.on('shutdown', () => {
      eventBus.off(Events.FUNDING_CHANGED, this.onFundingChanged);
      eventBus.off(Events.PITCH_ROUND_START, this.onRoundStart);
    });
  }

  flashFunding(color) {
    const flash = this.add.graphics();
    flash.fillStyle(color, 0.15);
    flash.fillRoundedRect(
      GAME.WIDTH * 0.01,
      GAME.HEIGHT * 0.005,
      GAME.WIDTH * 0.25,
      GAME.HEIGHT * 0.08,
      8 * PX,
    );

    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 500,
      ease: 'Quad.easeOut',
      onComplete: () => flash.destroy(),
    });
  }
}
