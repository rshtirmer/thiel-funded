/**
 * AudioManager.js
 * Central audio controller for the Thiel Funded game.
 *
 * - Initializes Strudel lazily on first user interaction (browser audio policy).
 * - Manages BGM playback via Strudel evaluate/hush.
 * - Manages SFX playback via the Web Audio API (oscillator-based, no samples).
 * - Respects gameState.isMuted.
 *
 * SFX use raw Web Audio oscillators instead of Strudel because Strudel's repl
 * is single-pattern: calling evaluate() for an SFX would replace the BGM.
 */

import { gameState } from '../core/GameState.js';
import { MENU_BGM, GAMEPLAY_BGM, GAMEOVER_BGM } from './music.js';
import { SFX_DEFINITIONS } from './sfxDefs.js';

const BGM_TRACKS = {
  menu: MENU_BGM,
  gameplay: GAMEPLAY_BGM,
  gameover: GAMEOVER_BGM,
};

let _instance = null;

export class AudioManager {
  constructor() {
    if (_instance) return _instance;
    _instance = this;

    this._strudelReady = false;
    this._strudelInitPromise = null;
    this._currentTrack = null;
    this._audioCtx = null;
    this._initListenersBound = false;
    this._bgmPlaying = false;

    // Bind the init trigger to user gestures
    this._onUserGesture = this._onUserGesture.bind(this);
    this._bindInitListeners();
  }

  static getInstance() {
    if (!_instance) {
      _instance = new AudioManager();
    }
    return _instance;
  }

  // --- Initialization ---

  /** Attach listeners that trigger audio init on first user interaction. */
  _bindInitListeners() {
    if (this._initListenersBound) return;
    this._initListenersBound = true;

    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(evt => {
      document.addEventListener(evt, this._onUserGesture, { once: false, passive: true });
    });
  }

  /** Called on the first user gesture to initialize Strudel and Web Audio. */
  async _onUserGesture() {
    if (this._strudelReady || this._strudelInitPromise) return;

    // Remove listeners once triggered
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(evt => {
      document.removeEventListener(evt, this._onUserGesture);
    });

    this._strudelInitPromise = this._initAudio();

    try {
      await this._strudelInitPromise;
      this._strudelReady = true;
      console.log('[AudioManager] Audio initialized successfully');
    } catch (err) {
      console.warn('[AudioManager] Audio init failed (game will continue without audio):', err.message);
      this._strudelReady = false;
    }
  }

  /** Initialize both Strudel (for BGM) and a Web Audio context (for SFX). */
  async _initAudio() {
    // Initialize Strudel
    try {
      const { initStrudel } = await import('@strudel/web');
      await initStrudel();
    } catch (err) {
      console.warn('[AudioManager] Strudel init failed:', err.message);
    }

    // Create Web Audio context for SFX
    try {
      this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (this._audioCtx.state === 'suspended') {
        await this._audioCtx.resume();
      }
    } catch (err) {
      console.warn('[AudioManager] Web Audio context creation failed:', err.message);
    }
  }

  // --- BGM ---

  /** Play a named BGM track ('menu', 'gameplay', 'gameover'). */
  async playMusic(trackName) {
    if (this._currentTrack === trackName && this._bgmPlaying) return;

    this._currentTrack = trackName;

    if (gameState.isMuted) {
      // Remember what track should play, but do not start it
      this._bgmPlaying = false;
      return;
    }

    if (!this._strudelReady) {
      // Strudel not ready yet; will not play music until init completes
      return;
    }

    const code = BGM_TRACKS[trackName];
    if (!code) {
      console.warn(`[AudioManager] Unknown BGM track: ${trackName}`);
      return;
    }

    try {
      const { evaluate } = await import('@strudel/web');
      await evaluate(code);
      this._bgmPlaying = true;
    } catch (err) {
      console.warn(`[AudioManager] Failed to play BGM "${trackName}":`, err.message);
    }
  }

  /** Stop all BGM. */
  async stopMusic() {
    this._bgmPlaying = false;
    this._currentTrack = null;

    if (!this._strudelReady) return;

    try {
      const { hush } = await import('@strudel/web');
      hush();
    } catch (err) {
      console.warn('[AudioManager] Failed to stop BGM:', err.message);
    }
  }

  // --- SFX (Web Audio oscillators) ---

  /**
   * Play a named SFX. SFX are defined in sfxDefs.js as arrays of
   * oscillator note descriptors so they can be played as one-shot sounds
   * without interrupting the BGM Strudel pattern.
   */
  playSFX(name) {
    if (gameState.isMuted) return;
    if (!this._audioCtx) return;

    const def = SFX_DEFINITIONS[name];
    if (!def) {
      console.warn(`[AudioManager] Unknown SFX: ${name}`);
      return;
    }

    try {
      const now = this._audioCtx.currentTime;
      def.forEach((noteDef, i) => {
        this._playOscNote(noteDef, now + (noteDef.delay || i * 0.06));
      });
    } catch (err) {
      console.warn(`[AudioManager] Failed to play SFX "${name}":`, err.message);
    }
  }

  /**
   * Play a single oscillator note.
   * @param {Object} note - { freq, type, gain, attack, decay, sustain, release, duration, delay }
   * @param {number} startTime - AudioContext time to start
   */
  _playOscNote(note, startTime) {
    const ctx = this._audioCtx;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = note.type || 'sine';
    osc.frequency.value = note.freq || 440;

    filter.type = 'lowpass';
    filter.frequency.value = note.lpf || 4000;

    const gain = note.gain || 0.1;
    const attack = note.attack || 0.01;
    const decay = note.decay || 0.1;
    const sustain = note.sustain || 0;
    const release = note.release || 0.05;
    const duration = note.duration || (attack + decay + release + 0.05);

    // Envelope
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(gain, startTime + attack);
    gainNode.gain.linearRampToValueAtTime(gain * sustain, startTime + attack + decay);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

    // Connect
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);

    // Cleanup
    osc.onended = () => {
      osc.disconnect();
      filter.disconnect();
      gainNode.disconnect();
    };
  }

  // --- Mute ---

  /** Toggle mute state. */
  async toggleMute() {
    gameState.isMuted = !gameState.isMuted;

    if (gameState.isMuted) {
      // Stop BGM
      if (this._bgmPlaying) {
        try {
          const { hush } = await import('@strudel/web');
          hush();
        } catch (_) { /* ignore */ }
        this._bgmPlaying = false;
      }
    } else {
      // Resume BGM if a track was selected
      if (this._currentTrack && this._strudelReady) {
        const code = BGM_TRACKS[this._currentTrack];
        if (code) {
          try {
            const { evaluate } = await import('@strudel/web');
            await evaluate(code);
            this._bgmPlaying = true;
          } catch (_) { /* ignore */ }
        }
      }
    }
  }

  /** Check current mute state. */
  get isMuted() {
    return gameState.isMuted;
  }
}
