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

  // Add points incrementally as funding changes
  eventBus.on(Events.FUNDING_CHANGED, ({ change }) => {
    if (initialized && change > 0) {
      sdk.addPoints(change);
    }
  });

  // Only save after all 5 questions are answered
  eventBus.on(Events.GAME_OVER, () => {
    if (initialized) sdk.savePoints();
  });
}
