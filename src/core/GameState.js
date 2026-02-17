class GameState {
  constructor() {
    this.isMuted = false;
    this.bestFunding = 0;
    this.reset();
  }

  reset() {
    this.funding = 0;
    this.round = 0;
    this.totalRounds = 5;
    this.answers = [];
    this.currentScenario = null;
    this.scenarios = [];
    this.pitchComplete = false;
    this.started = false;
    this.gameOver = false;
  }

  addFunding(amount) {
    this.funding += amount;
    if (this.funding > this.bestFunding) {
      this.bestFunding = this.funding;
    }
  }

  recordAnswer(scenarioId, tier, funding, round) {
    this.answers.push({ scenarioId, tier, funding, round });
  }

  getVerdict() {
    if (this.funding <= 0) return 'REJECTED';
    if (this.funding <= 25) return 'ANGEL ROUND';
    if (this.funding <= 75) return 'SERIES A';
    if (this.funding <= 150) return 'SERIES B';
    return 'FOUNDERS FUND';
  }
}

export const gameState = new GameState();
