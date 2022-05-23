import themes from './themes';

export default class GameState {
  constructor() {
    this.bindPers = 0;
    this.stage = 1;
    this.them = themes[this.stage - 1];
    this.start = 0;
    this.score = 0;
    this.arrPositionedCharacter = [];
    this.numEnemy = null;
    this.numPlayer = null;
  }
}
