/**
 * AudioBridge.js
 * Connects EventBus events to AudioManager playback.
 * Call initAudioBridge() once at game startup (after Phaser game init).
 */

import { eventBus, Events } from '../core/EventBus.js';
import { AudioManager } from './AudioManager.js';

export function initAudioBridge() {
  const audio = AudioManager.getInstance();

  // --- BGM transitions ---
  eventBus.on(Events.GAME_START, () => {
    audio.playMusic('gameplay');
  });

  eventBus.on(Events.GAME_OVER, () => {
    audio.playMusic('gameover');
  });

  eventBus.on(Events.GAME_RESTART, () => {
    audio.playMusic('menu');
  });

  // Audio control events
  eventBus.on(Events.MUSIC_MENU, () => {
    audio.playMusic('menu');
  });

  eventBus.on(Events.MUSIC_GAMEPLAY, () => {
    audio.playMusic('gameplay');
  });

  eventBus.on(Events.MUSIC_GAMEOVER, () => {
    audio.playMusic('gameover');
  });

  eventBus.on(Events.MUSIC_STOP, () => {
    audio.stopMusic();
  });

  // --- SFX triggers ---
  eventBus.on(Events.ANSWER_SELECTED, () => {
    audio.playSFX('answer_select');
  });

  eventBus.on(Events.ANSWER_RESULT, ({ tier }) => {
    if (tier === 'great') {
      audio.playSFX('great_answer');
    } else if (tier === 'ok') {
      audio.playSFX('ok_answer');
    } else {
      audio.playSFX('bad_answer');
    }
  });

  eventBus.on(Events.PITCH_ROUND_START, () => {
    audio.playSFX('round_transition');
  });

  eventBus.on(Events.FUNDING_CHANGED, ({ change }) => {
    if (change > 0) {
      audio.playSFX('funding_up');
    } else if (change < 0) {
      audio.playSFX('funding_down');
    }
  });

  eventBus.on(Events.PITCH_COMPLETE, () => {
    audio.playSFX('verdict_reveal');
  });

  // --- Mute toggle ---
  eventBus.on(Events.AUDIO_TOGGLE_MUTE, () => {
    audio.toggleMute();
  });

  // --- Audio init (from first user interaction in a scene) ---
  eventBus.on(Events.AUDIO_INIT, () => {
    // This is a no-op since AudioManager handles init via document listeners.
    // Kept for compatibility with the event contract.
  });
}
