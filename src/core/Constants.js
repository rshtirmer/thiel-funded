// --- Display ---

// Device pixel ratio (capped at 2 for mobile GPU performance)
export const DPR = Math.min(window.devicePixelRatio || 1, 2);

// Orientation: landscape on desktop, portrait on mobile
const _isPortrait = window.innerHeight > window.innerWidth;

// Design dimensions (logical game units at 1x scale)
const _designW = _isPortrait ? 540 : 960;
const _designH = _isPortrait ? 960 : 540;
const _designAspect = _designW / _designH;

// Canvas dimensions = device pixel area, maintaining design aspect ratio.
const _deviceW = window.innerWidth * DPR;
const _deviceH = window.innerHeight * DPR;

let _canvasW, _canvasH;
if (_deviceW / _deviceH > _designAspect) {
  _canvasW = _deviceW;
  _canvasH = Math.round(_deviceW / _designAspect);
} else {
  _canvasW = Math.round(_deviceH * _designAspect);
  _canvasH = _deviceH;
}

// PX = canvas pixels per design pixel.
export const PX = _canvasW / _designW;

export const GAME = {
  WIDTH: _canvasW,
  HEIGHT: _canvasH,
  IS_PORTRAIT: _isPortrait,
};

// --- Pitch Configuration ---

export const PITCH = {
  TOTAL_ROUNDS: 5,
  TIME_PER_ROUND: 15000,
  PAUSE_BETWEEN_ROUNDS: 1500,
  TYPEWRITER_SPEED: 30,
  ANSWER_STAGGER_DELAY: 150,
  SCENARIOS_PER_GAME: 5,
};

// --- Funding ---

export const FUNDING = {
  STARTING: 0,
  GREAT_MIN: 20,
  GREAT_MAX: 50,
  OK_MIN: 1,
  OK_MAX: 5,
  BAD_MIN: -20,
  BAD_MAX: -10,
};

// --- Thiel Face ---

export const THIEL_FACE = {
  SIZE: 160 * PX,
  X: _isPortrait ? _canvasW * 0.5 : _canvasW * 0.78,
  Y: _isPortrait ? _canvasH * 0.12 : _canvasH * 0.28,
};

// --- Colors (Dark Corporate Theme) ---

export const COLORS = {
  // Backgrounds
  BG_TOP: 0x0a0e1a,
  BG_BOTTOM: 0x1a1f3a,
  BG_DARK: 0x0d1117,
  BG_PANEL: 0x161b22,

  // Accent / Gold / Money
  GOLD: '#ffd700',
  GOLD_HEX: 0xffd700,
  MONEY_GREEN: '#00e676',
  MONEY_GREEN_HEX: 0x00e676,
  MONEY_RED: '#ff5252',
  MONEY_RED_HEX: 0xff5252,

  // UI text
  UI_TEXT: '#ffffff',
  UI_SHADOW: '#000000',
  MUTED_TEXT: '#8888aa',
  THIEL_SPEECH: '#e0e0e0',

  // Answer tiers
  ANSWER_DEFAULT: 0x2a2f4a,
  ANSWER_HOVER: 0x3a3f5a,
  ANSWER_GREAT: 0x1b5e20,
  ANSWER_OK: 0x4a6741,
  ANSWER_BAD: 0x7f1d1d,
  ANSWER_SELECTED: 0x4a90d9,

  // Buttons
  BTN_PRIMARY: 0xc9a84c,
  BTN_PRIMARY_HOVER: 0xdbb960,
  BTN_PRIMARY_PRESS: 0xb0913e,
  BTN_TEXT: '#1a1a2e',

  // Thiel face
  SKIN: 0xf5d0a9,
  SKIN_DARK: 0xd4a574,
  HAIR: 0x8b7355,
  SUIT: 0x2c2c3e,
  TIE: 0x8b0000,
  EYES: 0x4a6fa5,
  MOUTH: 0xc4856a,

  // Speech bubble
  BUBBLE_BG: 0x1e2338,
  BUBBLE_BORDER: 0x3a4060,

  // Verdict
  REJECTED: '#ff5252',
  ANGEL: '#ffd700',
  SERIES_A: '#00e676',
  SERIES_B: '#00bcd4',
  FOUNDERS_FUND: '#e040fb',
};

// --- UI sizing ---

export const UI = {
  FONT: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  TITLE_RATIO: 0.08,
  TITLE_RATIO_PORTRAIT: 0.055,
  HEADING_RATIO: 0.05,
  HEADING_RATIO_PORTRAIT: 0.038,
  BODY_RATIO: 0.032,
  SMALL_RATIO: 0.022,
  SMALL_RATIO_PORTRAIT: 0.018,
  BTN_W_RATIO: 0.45,
  BTN_H_RATIO: 0.075,
  BTN_RADIUS: 12 * PX,
  MIN_TOUCH: 44 * PX,
  SCORE_SIZE_RATIO: 0.035,
  SCORE_STROKE: 4 * PX,
  TITLE_MAX_WIDTH_RATIO: 0.90,
  // Pitch-specific
  ANSWER_BTN_W_RATIO: 0.85,
  ANSWER_BTN_H_RATIO: _isPortrait ? 0.065 : 0.10,
  ANSWER_FONT_RATIO: _isPortrait ? 0.020 : 0.028,
  SPEECH_FONT_RATIO: _isPortrait ? 0.024 : 0.030,
  FUNDING_DISPLAY_RATIO: 0.045,
  // Answer button number badge
  BADGE_RADIUS_RATIO: 0.015,
};

// --- Transitions ---

export const TRANSITION = {
  FADE_DURATION: 350,
  SCORE_POP_SCALE: 1.3,
  SCORE_POP_DURATION: 150,
  WIPE_DURATION: 400,
};

// --- Visual Effects ---

export const VFX = {
  // Camera shake on bad answers
  SHAKE_DURATION: 200,
  SHAKE_INTENSITY: 0.005,
  // Gold flash on great answers
  FLASH_DURATION: 300,
  FLASH_R: 255,
  FLASH_G: 215,
  FLASH_B: 0,
  // Money rain on great answers
  MONEY_RAIN_COUNT: 12,
  MONEY_RAIN_DURATION: 1800,
  MONEY_RAIN_FONT_RATIO: 0.035,
  MONEY_RAIN_SWAY: 40,
  // Typewriter cursor
  CURSOR_BLINK_RATE: 400,
  // Menu entrance stagger
  MENU_TITLE_SLIDE_DURATION: 500,
  MENU_FACE_FADE_DURATION: 600,
  MENU_BTN_SLIDE_DURATION: 450,
  MENU_SUBTITLE_FADE_DURATION: 400,
  MENU_STAGGER_OFFSET: 150,
  // Funding glow
  FUNDING_GLOW_ALPHA: 0.12,
  FUNDING_GLOW_PULSE_DURATION: 1500,
  // GameOver confetti
  CONFETTI_COUNT: 30,
  CONFETTI_DURATION: 2500,
  CONFETTI_COLORS: ['#ffd700', '#e040fb', '#00e676', '#00bcd4', '#ff5252', '#ffffff'],
  // GameOver zoom
  VERDICT_ZOOM_SCALE: 1.15,
  VERDICT_ZOOM_DURATION: 2000,
  // Funding counter acceleration
  COUNTER_DURATION: 1500,
};

// --- Verdicts ---

export const VERDICTS = [
  { min: -Infinity, max: 0, title: 'REJECTED', quote: '"You\'re not even wrong."', color: COLORS.REJECTED, expression: 'disgusted' },
  { min: 1, max: 25, title: 'ANGEL ROUND', quote: '"I\'ll throw in some pocket change. Don\'t disappoint me."', color: COLORS.ANGEL, expression: 'neutral' },
  { min: 26, max: 75, title: 'SERIES A', quote: '"You have definite optimism. Rare in this town."', color: COLORS.SERIES_A, expression: 'neutral' },
  { min: 76, max: 150, title: 'SERIES B', quote: '"This could be a Zero to One company."', color: COLORS.SERIES_B, expression: 'impressed' },
  { min: 151, max: Infinity, title: 'FOUNDERS FUND', quote: '"Welcome to the PayPal Mafia. Don\'t tell the SEC."', color: COLORS.FOUNDERS_FUND, expression: 'impressed' },
];
