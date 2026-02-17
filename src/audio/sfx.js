/**
 * sfx.js
 * Sound effects as short Strudel code strings.
 * Each SFX is a one-shot pattern that plays once.
 * All volumes are kept deliberately subtle for a dialogue-heavy game.
 */

// Quick, quiet click for each character typed
export const SFX_TYPEWRITER_TICK = `note("c6")
  .s("square")
  .gain(0.015)
  .decay(0.02)
  .sustain(0)
  .release(0.01)
  .lpf(4000)`;

// Satisfying click/chime when choosing an answer
export const SFX_ANSWER_SELECT = `note("e5 g5")
  .s("sine")
  .gain(0.08)
  .decay(0.15)
  .sustain(0)
  .release(0.1)
  .lpf(3000)`;

// Ascending bright notes - cha-ching feel
export const SFX_GREAT_ANSWER = `note("c5 e5 g5 c6")
  .s("sine")
  .gain(0.1)
  .decay(0.2)
  .sustain(0.1)
  .release(0.15)
  .lpf(4000)`;

// Neutral acknowledgment tone
export const SFX_OK_ANSWER = `note("e4 e4")
  .s("triangle")
  .gain(0.06)
  .decay(0.15)
  .sustain(0.05)
  .release(0.1)
  .lpf(2000)`;

// Descending low notes, buzzer-like
export const SFX_BAD_ANSWER = `note("e3 c3 a2")
  .s("sawtooth")
  .gain(0.08)
  .decay(0.25)
  .sustain(0.05)
  .release(0.15)
  .lpf(600)`;

// Quick ascending arpeggio (money sound)
export const SFX_FUNDING_UP = `note("c5 e5 g5")
  .s("triangle")
  .gain(0.07)
  .decay(0.12)
  .sustain(0.05)
  .release(0.1)
  .lpf(3500)`;

// Quick descending notes
export const SFX_FUNDING_DOWN = `note("g4 e4 c4")
  .s("triangle")
  .gain(0.06)
  .decay(0.12)
  .sustain(0.05)
  .release(0.1)
  .lpf(1500)`;

// Whoosh/sweep sound for round transitions
export const SFX_ROUND_TRANSITION = `note("c3 e4")
  .s("sine")
  .gain(0.07)
  .attack(0.05)
  .decay(0.3)
  .sustain(0.1)
  .release(0.3)
  .lpf(1000)`;

// Dramatic reveal sting
export const SFX_VERDICT_REVEAL = `note("e3 b3 e4 g4 b4")
  .s("sine")
  .gain(0.1)
  .decay(0.3)
  .sustain(0.2)
  .release(0.4)
  .lpf(3000)`;

// Very subtle tick for button hover
export const SFX_BUTTON_HOVER = `note("a5")
  .s("sine")
  .gain(0.01)
  .decay(0.02)
  .sustain(0)
  .release(0.01)
  .lpf(5000)`;

/**
 * Map of SFX names to their Strudel code strings.
 */
export const SFX_MAP = {
  typewriter_tick: SFX_TYPEWRITER_TICK,
  answer_select: SFX_ANSWER_SELECT,
  great_answer: SFX_GREAT_ANSWER,
  ok_answer: SFX_OK_ANSWER,
  bad_answer: SFX_BAD_ANSWER,
  funding_up: SFX_FUNDING_UP,
  funding_down: SFX_FUNDING_DOWN,
  round_transition: SFX_ROUND_TRANSITION,
  verdict_reveal: SFX_VERDICT_REVEAL,
  button_hover: SFX_BUTTON_HOVER,
};
