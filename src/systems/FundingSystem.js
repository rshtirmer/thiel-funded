import { eventBus, Events } from '../core/EventBus.js';
import { gameState } from '../core/GameState.js';

/**
 * FundingSystem - Manages funding amount and emits funding change events.
 */
export class FundingSystem {
  constructor() {
    this.onAnswerResult = this.onAnswerResult.bind(this);
    eventBus.on(Events.ANSWER_RESULT, this.onAnswerResult);
  }

  onAnswerResult({ funding, tier, scenarioId, round }) {
    const previousFunding = gameState.funding;
    gameState.addFunding(funding);
    gameState.recordAnswer(scenarioId, tier, funding, round);

    eventBus.emit(Events.FUNDING_CHANGED, {
      funding: gameState.funding,
      previousFunding,
      change: funding,
      tier,
    });
  }

  destroy() {
    eventBus.off(Events.ANSWER_RESULT, this.onAnswerResult);
  }
}
