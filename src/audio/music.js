/**
 * music.js
 * Background music tracks defined as Strudel code strings.
 * Each track is a Strudel pattern that loops cleanly.
 * Patterns use built-in synth sounds (no samples needed).
 */

// Menu BGM: Mysterious, corporate, slightly ominous
// Slow tempo, minor key, deep bass + atmospheric pads
export const MENU_BGM = `setcps(0.35)
stack(
  // Deep bass drone in E minor
  note("e1 e1 b0 e1")
    .s("sine")
    .gain(0.18)
    .decay(1.5)
    .sustain(0.8)
    .release(0.5)
    .lpf(200),
  // High atmospheric pad - eerie fifths
  note("<e4 b3 g3 b3>/4")
    .s("sine")
    .gain(0.06)
    .attack(0.8)
    .decay(0.5)
    .sustain(0.9)
    .release(1.0)
    .lpf(2000),
  // Subtle mid-range texture
  note("<b2 ~ e3 ~>/8")
    .s("triangle")
    .gain(0.04)
    .attack(0.5)
    .decay(0.8)
    .sustain(0.3)
    .release(0.6)
    .lpf(800)
)`;

// Gameplay BGM: Tense, thinking music with nervous energy
// Medium tempo, staccato notes suggesting nervousness
export const GAMEPLAY_BGM = `setcps(0.5)
stack(
  // Tense bass pulse
  note("e2 ~ e2 g2 ~ e2 a2 ~")
    .s("triangle")
    .gain(0.14)
    .decay(0.3)
    .sustain(0.1)
    .release(0.2)
    .lpf(400),
  // Nervous staccato mid notes
  note("<e3 g3 b3 a3>/2")
    .s("square")
    .gain(0.04)
    .decay(0.15)
    .sustain(0.05)
    .release(0.1)
    .lpf(1200),
  // Subtle high tension drone
  note("<b4 e5>/4")
    .s("sine")
    .gain(0.03)
    .attack(0.6)
    .decay(0.3)
    .sustain(0.7)
    .release(0.5)
    .lpf(3000)
)`;

// Game Over BGM: Bittersweet / reflective
// Works for both good and bad results
export const GAMEOVER_BGM = `setcps(0.3)
stack(
  // Reflective bass - descending then ascending
  note("e2 d2 c2 d2")
    .s("sine")
    .gain(0.15)
    .decay(1.0)
    .sustain(0.6)
    .release(0.8)
    .lpf(300),
  // Bittersweet chord pads
  note("<e3,g3,b3> <d3,f3,a3> <c3,e3,g3> <d3,f#3,a3>")
    .s("sine")
    .gain(0.06)
    .attack(0.5)
    .decay(0.6)
    .sustain(0.8)
    .release(1.0)
    .lpf(1800),
  // Gentle high melody
  note("<b4 a4 g4 a4>/4")
    .s("triangle")
    .gain(0.03)
    .attack(0.3)
    .decay(0.5)
    .sustain(0.3)
    .release(0.6)
    .lpf(2500)
)`;
