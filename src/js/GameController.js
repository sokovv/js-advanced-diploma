import GamePlay from './GamePlay';
import attackRud from './AttackRud';
import moveRud from './MoveRud';
import themes from './themes';
import cursors from './cursors';
import {
  TeamPlayerBoard, TeamEnemyBoard, TeamPlayerRand, TeamEnemyrRand,
} from './TeamPlayer';
import PositionedCharacter from './PositionedCharacter';
import levelUp from './LevelUp';

const typePlayer = ['bowman', 'swordsman', 'magician'];
const typeEnemy = ['daemon', 'undead', 'vampire'];

export default class GameController {
  constructor(gamePlay, stateService, gameState) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = gameState;
  }

  init() {
    this.gameLoop();
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
    const stateGame = this.gameState;
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
    this.attack(index);
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
          this.bind(index);
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

  bind(index) {
    this.gameState.bindPers.position = index;
    this.gamePlay.selectCell(index, 'yellow');
    this.gamePlay.redrawPositions(this.gameState.arrPositionedCharacter);
    this.enemyAction();
  }

  attack(index) {
    for (let i = 0; i < this.gameState.arrPositionedCharacter.length; i++) {
      const num = this.gameState.arrPositionedCharacter[i].character.type;
      if (this.gameState.bindPers !== 0
        && this.gameState.arrPositionedCharacter[i].position === index
        && typeEnemy.some((type) => num === type)
        && typePlayer.some((type) => this.gameState.bindPers.character.type === type)
        && attackRud(
          this.gameState.bindPers.position,
          this.gameState.bindPers.character.rudAttack,
        ).some((number) => index === number)
      ) {
        const damage = Math.max(
          this.gameState.bindPers.character.attack
          - this.gameState.arrPositionedCharacter[i].character.defence,
          this.gameState.bindPers.character.attack * 0.1,
        );
        this.gamePlay.showDamage(index, damage).then(() => {
          this.gameState.arrPositionedCharacter[i].character.health -= damage;
          if (this.gameState.arrPositionedCharacter[i].character.health <= 0) {
            this.gameState.arrPositionedCharacter.splice(i, 1);
            this.gameLoop();
          }
          this.enemyAction();
        });
      }
    }
  }

  enemyAction() {
    const numEnemy = [];
    const numPlayer = [];

    for (let i = 0; i < this.gameState.arrPositionedCharacter.length; i++) {
      if (typeEnemy.some((num) => this.gameState.arrPositionedCharacter[i].character.type
       === num)) {
        numEnemy.push(this.gameState.arrPositionedCharacter[i]);
      }
    }
    for (let i = 0; i < this.gameState.arrPositionedCharacter.length; i++) {
      if (typePlayer.some((num) => this.gameState.arrPositionedCharacter[i].character.type
      === num)) {
        numPlayer.push(this.gameState.arrPositionedCharacter[i]);
      }
    }
    function random(arr, matchedRud, activePos) {
      const rand = Math.floor(Math.random() * arr.length);
      if (activePos === arr[rand]) {
        return random(arr, matchedRud, activePos);
      }
      if (matchedRud !== undefined) {
        if (matchedRud.some((num) => num.position === arr[rand])) {
          return random(arr, matchedRud, activePos);
        }
      }
      return arr[rand];
    }

    const activeEnemy = random(numEnemy);
    let rudEnemy = [];
    let rudEnemyAttack = [];
    if (activeEnemy) {
      rudEnemy = moveRud(
        activeEnemy.position,
        activeEnemy.character.rudMove,
      ).filter((item) => item > 0 && item < 64);
      rudEnemyAttack = attackRud(
        activeEnemy.position,
        activeEnemy.character.rudAttack,
      ).filter((item) => item > 0 && item < 64);
    }
    const matched = numPlayer.filter((el) => rudEnemyAttack.indexOf(el.position) > -1);
    const matchedRud = numPlayer.filter((el) => rudEnemy.indexOf(el.position) > -1);

    if (matched.length <= 0 && activeEnemy) {
      activeEnemy.position = random(rudEnemy, matchedRud, activeEnemy.position);
      this.gamePlay.redrawPositions(this.gameState.arrPositionedCharacter);
    } else if (activeEnemy) {
      const activePers = random(matched);
      const damage = Math.max(
        activeEnemy.character.attack - activePers.character.defence,
        activeEnemy.character.attack * 0.1,
      );
      this.gamePlay.showDamage(activePers.position, damage).then(() => {
        activePers.character.health -= damage;
        if (activePers.character.health <= 0) {
          const delPers = numPlayer.findIndex((item) => item.character.health <= 0);
          this.gameState.arrPositionedCharacter.splice(delPers, 1);
          this.gameLoop();
          this.gamePlay.redrawPositions(this.gameState.arrPositionedCharacter);
        }
        this.gamePlay.redrawPositions(this.gameState.arrPositionedCharacter);
      });
    }
    this.gameState.bindPers = 0;
  }

  gameLoop() {
    const numEnemy = [];
    const numPlayer = [];
    let playerTeam;
    let enemyTeam;
    const { arrPositionedCharacter } = this.gameState;

    function posCharPlayer() {
      for (let i = 0; i < playerTeam.length; i++) {
        const randBoardPlayer = TeamPlayerBoard()[
          Math.floor(Math.random() * TeamPlayerBoard().length)];
        const positionedCharacter = new PositionedCharacter(playerTeam[i], randBoardPlayer);
        arrPositionedCharacter.push(positionedCharacter);
      }
    }
    function posCharEnemy() {
      for (let i = 0; i < enemyTeam.length; i++) {
        const randBoardEnemy = TeamEnemyBoard()[
          Math.floor(Math.random() * TeamEnemyBoard().length)];
        const positionedCharacter = new PositionedCharacter(enemyTeam[i], randBoardEnemy);
        arrPositionedCharacter.push(positionedCharacter);
      }
    }

    function numEnem() {
      for (let i = 0; i < arrPositionedCharacter.length; i++) {
        if (typeEnemy.some((num) => arrPositionedCharacter[i].character.type === num)) {
          numEnemy.push(arrPositionedCharacter[i]);
        }
      }
    }
    function numPlay() {
      for (let i = 0; i < arrPositionedCharacter.length; i++) {
        if (typePlayer.some((num) => arrPositionedCharacter[i].character.type === num)) {
          numPlayer.push(arrPositionedCharacter[i]);
        }
      }
    }
    if (this.gameState.start === 0) {
      playerTeam = TeamPlayerRand(1, 1, 2);
      enemyTeam = TeamEnemyrRand(1, 2);
      posCharPlayer();
      posCharEnemy();
      this.gameState.start += 1;
    }
    this.gameState.arrPositionedCharacter = arrPositionedCharacter;
    numEnem();
    numPlay();
    if (numPlayer.length === 0 && this.gameState.start !== 0) {
      GamePlay.showError('ВЫ ПРОИГРАЛИ!');
      this.gamePlay.cellClickListeners = [];
      this.gamePlay.cellEnterListeners = [];
      this.gamePlay.cellLeaveListeners = [];
    }
    if (numEnemy.length === 0 && this.gameState.stage < 4) {
      this.gameState.stage += 1;
      this.gameState.them = themes[this.gameState.stage - 1];
      this.gamePlay.drawUi(this.gameState.them);
      let counStage = this.gameState.stage - 1;
      if (this.gameState.stage === 4) {
        counStage = 2;
      }
      for (let i = 0; i < numPlayer.length; i++) {
        const randBoardPlayer = TeamPlayerBoard()[Math.floor(Math.random()
          * TeamPlayerBoard().length)];
        this.gameState.score += numPlayer[i].character.health;
        numPlayer[i].position = randBoardPlayer;
        levelUp(numPlayer[i].character);
      }
      playerTeam = TeamPlayerRand(this.gameState.stage, this.gameState.stage - 1, counStage);
      posCharPlayer();
      enemyTeam = TeamEnemyrRand(this.gameState.stage, arrPositionedCharacter.length);
      posCharEnemy();
      numEnem();
      for (let i = 0; i < numEnemy.length; i++) {
        if (numEnemy[i].character.level > 1) {
          numEnemy[i].character.attack *= 1 + ((numEnemy[i].character.level - 1) * 0.8);
          numEnemy[i].character.defence *= 1 + ((numEnemy[i].character.level - 1) * 0.8);
        }
      }
      this.gamePlay.redrawPositions(this.gameState.arrPositionedCharacter);
    } else if (numEnemy.length === 0 && this.gameState.stage === 4) {
      for (let i = 0; i < numPlayer.length; i++) {
        this.gameState.score += numPlayer[i].character.health;
      }
      GamePlay.showError(`Вы выиграли! Набрано очков ${this.gameState.score}`);
      this.gamePlay.cellClickListeners = [];
      this.gamePlay.cellEnterListeners = [];
      this.gamePlay.cellLeaveListeners = [];
    }
  }
}
