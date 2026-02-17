/**
 * sfxDefs.js
 * Sound effect definitions as arrays of oscillator note descriptors.
 * Each SFX is an array of notes that play in sequence (or simultaneously
 * if delay values overlap). Uses raw Web Audio frequencies.
 *
 * Note descriptor fields:
 *   freq     - Frequency in Hz
 *   type     - Oscillator type: 'sine', 'square', 'triangle', 'sawtooth'
 *   gain     - Peak volume (0..1), keep SUBTLE (this is a dialogue game)
 *   attack   - Time to reach peak gain (seconds)
 *   decay    - Time from peak to sustain level (seconds)
 *   sustain  - Sustain level as fraction of gain (0..1)
 *   release  - Time to fade to 0 after sustain (seconds)
 *   duration - Total note duration (seconds)
 *   delay    - Delay from SFX start (seconds), overrides sequential timing
 *   lpf      - Low-pass filter cutoff (Hz)
 *
 * Frequency reference (equal temperament, A4=440):
 *   C3=130.8  D3=146.8  E3=164.8  F3=174.6  G3=196.0  A3=220.0  B3=246.9
 *   C4=261.6  D4=293.7  E4=329.6  F4=349.2  G4=392.0  A4=440.0  B4=493.9
 *   C5=523.3  D5=587.3  E5=659.3  F5=698.5  G5=784.0  A5=880.0  B5=987.8
 *   C6=1046.5 D6=1174.7 E6=1318.5
 */

export const SFX_DEFINITIONS = {

  // Quick, quiet click for each character typed (very subtle)
  typewriter_tick: [
    {
      freq: 1046.5, type: 'square', gain: 0.012,
      attack: 0.003, decay: 0.015, sustain: 0, release: 0.01,
      duration: 0.03, delay: 0, lpf: 4000,
    },
  ],

  // Satisfying click/chime when choosing an answer
  answer_select: [
    {
      freq: 659.3, type: 'sine', gain: 0.08,
      attack: 0.01, decay: 0.1, sustain: 0.05, release: 0.08,
      duration: 0.2, delay: 0, lpf: 3000,
    },
    {
      freq: 784.0, type: 'sine', gain: 0.07,
      attack: 0.01, decay: 0.1, sustain: 0.05, release: 0.08,
      duration: 0.2, delay: 0.06, lpf: 3000,
    },
  ],

  // Ascending bright notes, cash register "cha-ching" feel
  great_answer: [
    {
      freq: 523.3, type: 'sine', gain: 0.09,
      attack: 0.01, decay: 0.12, sustain: 0.1, release: 0.1,
      duration: 0.25, delay: 0, lpf: 4000,
    },
    {
      freq: 659.3, type: 'sine', gain: 0.09,
      attack: 0.01, decay: 0.12, sustain: 0.1, release: 0.1,
      duration: 0.25, delay: 0.08, lpf: 4000,
    },
    {
      freq: 784.0, type: 'sine', gain: 0.09,
      attack: 0.01, decay: 0.12, sustain: 0.1, release: 0.1,
      duration: 0.25, delay: 0.16, lpf: 4000,
    },
    {
      freq: 1046.5, type: 'sine', gain: 0.1,
      attack: 0.01, decay: 0.15, sustain: 0.15, release: 0.15,
      duration: 0.35, delay: 0.24, lpf: 5000,
    },
  ],

  // Neutral acknowledgment tone
  ok_answer: [
    {
      freq: 329.6, type: 'triangle', gain: 0.06,
      attack: 0.01, decay: 0.12, sustain: 0.05, release: 0.08,
      duration: 0.22, delay: 0, lpf: 2000,
    },
    {
      freq: 329.6, type: 'triangle', gain: 0.05,
      attack: 0.01, decay: 0.1, sustain: 0.03, release: 0.08,
      duration: 0.2, delay: 0.1, lpf: 2000,
    },
  ],

  // Descending low notes, buzzer-like
  bad_answer: [
    {
      freq: 164.8, type: 'sawtooth', gain: 0.07,
      attack: 0.01, decay: 0.18, sustain: 0.05, release: 0.12,
      duration: 0.32, delay: 0, lpf: 600,
    },
    {
      freq: 130.8, type: 'sawtooth', gain: 0.06,
      attack: 0.01, decay: 0.18, sustain: 0.05, release: 0.12,
      duration: 0.32, delay: 0.12, lpf: 500,
    },
    {
      freq: 110.0, type: 'sawtooth', gain: 0.05,
      attack: 0.01, decay: 0.25, sustain: 0.05, release: 0.15,
      duration: 0.42, delay: 0.24, lpf: 400,
    },
  ],

  // Quick ascending arpeggio (money sound)
  funding_up: [
    {
      freq: 523.3, type: 'triangle', gain: 0.06,
      attack: 0.01, decay: 0.08, sustain: 0.05, release: 0.06,
      duration: 0.16, delay: 0, lpf: 3500,
    },
    {
      freq: 659.3, type: 'triangle', gain: 0.06,
      attack: 0.01, decay: 0.08, sustain: 0.05, release: 0.06,
      duration: 0.16, delay: 0.05, lpf: 3500,
    },
    {
      freq: 784.0, type: 'triangle', gain: 0.07,
      attack: 0.01, decay: 0.1, sustain: 0.05, release: 0.08,
      duration: 0.2, delay: 0.10, lpf: 3500,
    },
  ],

  // Quick descending notes
  funding_down: [
    {
      freq: 392.0, type: 'triangle', gain: 0.05,
      attack: 0.01, decay: 0.08, sustain: 0.05, release: 0.06,
      duration: 0.16, delay: 0, lpf: 1500,
    },
    {
      freq: 329.6, type: 'triangle', gain: 0.05,
      attack: 0.01, decay: 0.08, sustain: 0.05, release: 0.06,
      duration: 0.16, delay: 0.05, lpf: 1500,
    },
    {
      freq: 261.6, type: 'triangle', gain: 0.05,
      attack: 0.01, decay: 0.1, sustain: 0.05, release: 0.08,
      duration: 0.2, delay: 0.10, lpf: 1200,
    },
  ],

  // Whoosh/sweep sound for round transitions
  round_transition: [
    {
      freq: 130.8, type: 'sine', gain: 0.06,
      attack: 0.03, decay: 0.2, sustain: 0.1, release: 0.2,
      duration: 0.45, delay: 0, lpf: 1000,
    },
    {
      freq: 329.6, type: 'sine', gain: 0.05,
      attack: 0.05, decay: 0.15, sustain: 0.1, release: 0.15,
      duration: 0.4, delay: 0.1, lpf: 1500,
    },
  ],

  // Dramatic reveal sting
  verdict_reveal: [
    {
      freq: 164.8, type: 'sine', gain: 0.08,
      attack: 0.02, decay: 0.2, sustain: 0.15, release: 0.25,
      duration: 0.5, delay: 0, lpf: 2000,
    },
    {
      freq: 246.9, type: 'sine', gain: 0.08,
      attack: 0.02, decay: 0.2, sustain: 0.15, release: 0.25,
      duration: 0.5, delay: 0.1, lpf: 2500,
    },
    {
      freq: 329.6, type: 'sine', gain: 0.08,
      attack: 0.02, decay: 0.2, sustain: 0.15, release: 0.25,
      duration: 0.5, delay: 0.2, lpf: 3000,
    },
    {
      freq: 392.0, type: 'sine', gain: 0.09,
      attack: 0.02, decay: 0.25, sustain: 0.2, release: 0.3,
      duration: 0.6, delay: 0.3, lpf: 3500,
    },
    {
      freq: 493.9, type: 'sine', gain: 0.1,
      attack: 0.02, decay: 0.3, sustain: 0.2, release: 0.35,
      duration: 0.7, delay: 0.4, lpf: 4000,
    },
  ],

  // Very subtle tick for button hover
  button_hover: [
    {
      freq: 880.0, type: 'sine', gain: 0.008,
      attack: 0.003, decay: 0.015, sustain: 0, release: 0.01,
      duration: 0.03, delay: 0, lpf: 5000,
    },
  ],
};
