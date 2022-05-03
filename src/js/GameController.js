import GamePlay from './GamePlay';
import attackRud from './AttackRud';
import moveRud from './MoveRud';
import themes from './themes';
import cursors from './cursors';
import GameState from './GameState';

const typePlayer = ['bowman', 'swordsman', 'magician'];
const typeEnemy = ['daemon', 'undead', 'vampire'];

export default class GameController {
  constructor(gamePlay, stateService, gameState) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = gameState;
  }

  init() {
    this.gameState.gameLoop();
    this.gamePlay.drawUi(this.gameState.them);
    this.gamePlay.redrawPositions(this.gameState.arrPositionedCharacter);
    this.addListener();
  }

  addListener() { // <- что это за метод и где это нужно сделать решите сами
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
  }

  onNewGameClick() {
    this.gamePlay.cellClickListeners = [];
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
    this.gameState.arrPositionedCharacter = [];
    this.gameState.stage = 1;
    this.gameState.them = themes[this.gameState.stage - 1];
    this.gameState.start = 0;
    this.init();
  }

  onSaveGameClick() {
    const stateGame = GameState.from(this.gameState);
    this.stateService.save(stateGame);
  }

  onLoadGameClick() {
    const load = this.stateService.load();
    if (typeof (load) === 'object') {
      this.gameState.bindPers = load.bindPers;
      this.gameState.stage = load.stage;
      this.gameState.them = themes[this.gameState.stage - 1];
      this.gameState.arrPositionedCharacter = load.arrPositionedCharacter;
      this.gameState.numEnemy = load.numEnemy;
      this.gameState.numPlayer = load.numPlayer;
      this.gamePlay.drawUi(this.gameState.them);
      this.gamePlay.redrawPositions(this.gameState.arrPositionedCharacter);
      this.gameState.score = load.score;
    } else {
      GamePlay.showError('Ошибка загрузки сохранения');
    }
  }

  onCellClick(index) {
    const arrCell = this.gamePlay.cells;
    arrCell.forEach((element) => element.classList.remove('selected'));
    this.gameState.attack(index);
    for (let i = 0; i < this.gameState.arrPositionedCharacter.length; i++) {
      const num = this.gameState.arrPositionedCharacter[i].character.type;
      if (this.gameState.arrPositionedCharacter[i].position === index
        && (typePlayer.some((type) => num === type))) {
        this.gamePlay.selectCell(index, 'yellow');
        this.gameState.bindPers = this.gameState.arrPositionedCharacter[i];
      }
      if (this.gameState.arrPositionedCharacter[i].position === index
        && (typeEnemy.some((type) => num === type)) && this.gameState.bindPers === 0) {
        GamePlay.showError('Это вражеский персонаж, им нельзя играть');
      }
    }

    if (this.gameState.bindPers !== 0
      && typePlayer.some((type) => this.gameState.bindPers.character.type === type)) {
      const g = moveRud(
        this.gameState.bindPers.position,
        this.gameState.bindPers.character.rudMove,
      );
      for (let i = 0; i < g.length; i++) {
        if (index === g[i]
          && this.gameState.arrPositionedCharacter.every((num) => index !== num.position)) {
          this.gameState.bind(index);
        }
      }
    }
  }

  onCellEnter(index) {
    if (this.gameState.bindPers !== 0
      && typePlayer.some((type) => this.gameState.bindPers.character.type === type)) {
      const g = moveRud(
        this.gameState.bindPers.position,
        this.gameState.bindPers.character.rudMove,
      );
      for (let i = 0; i < g.length; i++) {
        if (index === g[i]
          && index !== this.gameState.bindPers.position
        ) {
          this.gamePlay.setCursor(cursors.pointer);
          this.gamePlay.selectCell(index, 'green');
        }
      }
    }
    for (let i = 0; i < this.gameState.arrPositionedCharacter.length; i++) {
      if (this.gameState.arrPositionedCharacter[i].position === index) {
        this.gamePlay.showCellTooltip(`${String.fromCodePoint(0x1F396)}:${this.gameState.arrPositionedCharacter[i].character.level} ${String.fromCodePoint(0x2694)}:${this.gameState.arrPositionedCharacter[i].character.attack} ${String.fromCodePoint(0x1F6E1)}:${this.gameState.arrPositionedCharacter[i].character.defence} ${String.fromCodePoint(0x2764)}:${this.gameState.arrPositionedCharacter[i].character.health}`, index);
      }
    }
    for (let i = 0; i < this.gameState.arrPositionedCharacter.length; i++) {
      const num = this.gameState.arrPositionedCharacter[i].character.type;
      if (this.gameState.arrPositionedCharacter[i].position === index
        && (typePlayer.some((type) => num === type))) {
        this.gamePlay.setCursor(cursors.pointer);
      }
      if (this.gameState.arrPositionedCharacter[i].position === index
        && typeEnemy.some((type) => num === type) && this.gameState.bindPers !== 0
        && (typePlayer.some((type) => this.gameState.bindPers.character.type === type)
          && attackRud(
            this.gameState.bindPers.position,
            this.gameState.bindPers.character.rudAttack,
          ).some((number) => index === number))
      ) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, 'red');
      }
      if (this.gameState.arrPositionedCharacter[i].position === index
        && typeEnemy.some((type) => num === type) && this.gameState.bindPers !== 0
        && (typePlayer.some((type) => this.gameState.bindPers.character.type === type)
          && attackRud(
            this.gameState.bindPers.position,
            this.gameState.bindPers.character.rudAttack,
          ).every((number) => index !== number))
      ) {
        this.gamePlay.setCursor(cursors.notallowed);
        this.gamePlay.deselectCell(index);
      }
    }
  }

  onCellLeave(index) {
    this.gamePlay.setCursor(cursors.auto);
    if (index !== this.gameState.bindPers.position) {
      this.gamePlay.deselectCell(index);
    }
    for (let i = 0; i < this.gameState.arrPositionedCharacter.length; i++) {
      const num = this.gameState.arrPositionedCharacter[i].character.type;
      if (this.gameState.arrPositionedCharacter[i].position === index
        && (typeEnemy.some((type) => num === type))) {
        this.gamePlay.deselectCell(index);
      }
    }
  }
}
