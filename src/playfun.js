// Play.fun (OpenGameProtocol) integration
import { eventBus, Events } from './core/EventBus.js';

const GAME_ID = '9a2ab202-1356-4b80-8203-9430590c9048';
let sdk = null;
let initialized = false;

export async function initPlayFun() {
  const SDKClass = typeof PlayFunSDK !== 'undefined' ? PlayFunSDK
    : typeof OpenGameSDK !== 'undefined' ? OpenGameSDK : null;
  if (!SDKClass) {
    console.warn('Play.fun SDK not loaded');
    return;
  }
  sdk = new SDKClass({ ui: { usePointsWidget: true } });
  await sdk.init({ gameId: GAME_ID });
  initialized = true;

  // Track funding changes as points
  eventBus.on(Events.FUNDING_CHANGED, ({ funding, change }) => {
    if (initialized && change > 0) {
      sdk.addPoints(change);
    }
  });

  // Save points on game over
  eventBus.on(Events.GAME_OVER, () => {
    if (initialized) sdk.savePoints();
  });

  // Auto-save every 30s
  setInterval(() => {
    if (initialized) sdk.savePoints();
  }, 30000);

  // Save on page unload
  window.addEventListener('beforeunload', () => {
    if (initialized) sdk.savePoints();
  });
}
