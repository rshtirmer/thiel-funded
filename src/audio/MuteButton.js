/**
 * MuteButton.js
 * Adds a mute toggle button and keyboard shortcut to a Phaser scene.
 * Renders a text-based speaker icon in the top-right corner.
 * Press "M" or click/tap the icon to toggle mute.
 */

import { GAME, COLORS, UI, PX } from '../core/Constants.js';
import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';

/**
 * Add mute button and "M" key shortcut to a Phaser scene.
 * @param {Phaser.Scene} scene - The scene to add the button to.
 * @returns {{ muteText: Phaser.GameObjects.Text, muteKey: Phaser.Input.Keyboard.Key }}
 */
export function addMuteButton(scene) {
  const padding = GAME.WIDTH * 0.03;
  const fontSize = Math.round(GAME.HEIGHT * (GAME.IS_PORTRAIT ? UI.SMALL_RATIO_PORTRAIT : UI.SMALL_RATIO) * 1.4);

  // Speaker icon text in top-right corner
  const muteText = scene.add.text(
    GAME.WIDTH - padding,
    GAME.HEIGHT - padding,
    gameState.isMuted ? 'MUTED' : 'SND',
    {
      fontSize: fontSize + 'px',
      fontFamily: UI.FONT,
      color: gameState.isMuted ? COLORS.MONEY_RED : COLORS.MUTED_TEXT,
      fontStyle: 'bold',
    }
  ).setOrigin(1, 1).setDepth(200);

  // Make interactive
  muteText.setInteractive({ useHandCursor: true });

  muteText.on('pointerover', () => {
    muteText.setAlpha(0.8);
  });

  muteText.on('pointerout', () => {
    muteText.setAlpha(1);
  });

  muteText.on('pointerup', () => {
    eventBus.emit(Events.AUDIO_TOGGLE_MUTE);
    updateMuteText(muteText);
  });

  // "M" key shortcut
  const muteKey = scene.input.keyboard.addKey('M');
  muteKey.on('down', () => {
    eventBus.emit(Events.AUDIO_TOGGLE_MUTE);
    updateMuteText(muteText);
  });

  return { muteText, muteKey };
}

/** Update the mute icon text to reflect current state. */
function updateMuteText(muteText) {
  if (!muteText || !muteText.active) return;
  muteText.setText(gameState.isMuted ? 'MUTED' : 'SND');
  muteText.setColor(gameState.isMuted ? COLORS.MONEY_RED : COLORS.MUTED_TEXT);
}
