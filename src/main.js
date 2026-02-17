import Phaser from 'phaser';
import { GameConfig } from './core/GameConfig.js';
import { eventBus, Events } from './core/EventBus.js';
import { gameState } from './core/GameState.js';
import { initAudioBridge } from './audio/AudioBridge.js';
import { initPlayFun } from './playfun.js';

const game = new Phaser.Game(GameConfig);

// Initialize audio event bridge (connects EventBus events to AudioManager)
initAudioBridge();

// Initialize Play.fun SDK
initPlayFun().catch(err => console.warn('Play.fun init failed:', err));

// Expose for Playwright testing
window.__GAME__ = game;
window.__GAME_STATE__ = gameState;
window.__EVENT_BUS__ = eventBus;
window.__EVENTS__ = Events;

// --- AI-readable game state snapshot ---
window.render_game_to_text = () => {
  if (!game || !gameState) return JSON.stringify({ error: 'not_ready' });

  const activeScenes = game.scene.getScenes(true).map(s => s.scene.key);

  const mode = gameState.gameOver ? 'game_over' :
               gameState.started ? 'pitching' : 'menu';

  const payload = {
    coords: 'origin:top-left x:right y:down',
    mode,
    scene: activeScenes[0] || null,
    scenes: activeScenes,
    funding: gameState.funding,
    bestFunding: gameState.bestFunding,
    round: gameState.round,
    totalRounds: gameState.totalRounds,
    pitchComplete: gameState.pitchComplete,
    verdict: gameState.pitchComplete ? gameState.getVerdict() : null,
    answers: gameState.answers,
  };

  // Add current scenario info when pitching
  if (gameState.started && gameState.currentScenario) {
    payload.currentScenario = {
      id: gameState.currentScenario.id,
      question: gameState.currentScenario.thielQuestion,
    };
  }

  return JSON.stringify(payload);
};

// --- Deterministic time-stepping hook ---
window.advanceTime = (ms) => {
  return new Promise((resolve) => {
    const start = performance.now();
    function step() {
      if (performance.now() - start >= ms) return resolve();
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
};
