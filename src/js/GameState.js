import {
  TeamPlayerBoard, TeamEnemyBoard, TeamPlayerRand, TeamEnemyrRand,
} from './TeamPlayer';
import PositionedCharacter from './PositionedCharacter';
import levelUp from './LevelUp';
import GamePlay from './GamePlay';
import themes from './themes';
import attackRud from './AttackRud';
import moveRud from './MoveRud';

const typePlayer = ['bowman', 'swordsman', 'magician'];
const typeEnemy = ['daemon', 'undead', 'vampire'];

export default class GameState {
  constructor(gamePlay) {
    this.gamePlay = gamePlay;
    this.bindPers = 0;
    this.stage = 1;
    this.them = themes[this.stage - 1];
    this.start = 0;
    this.score = 0;
    this.arrPositionedCharacter = [];
    this.numEnemy = null;
    this.numPlayer = null;
  }

  static from(object) {
    return object;
  }

  bind(index) {
    this.bindPers.position = index;
    this.gamePlay.selectCell(index, 'yellow');
    this.gamePlay.redrawPositions(this.arrPositionedCharacter);
    this.enemyAction();
  }

  attack(index) {
    for (let i = 0; i < this.arrPositionedCharacter.length; i++) {
      const num = this.arrPositionedCharacter[i].character.type;
      if (this.bindPers !== 0
        && this.arrPositionedCharacter[i].position === index
        && typeEnemy.some((type) => num === type)
        && typePlayer.some((type) => this.bindPers.character.type === type)
        && attackRud(
          this.bindPers.position,
          this.bindPers.character.rudAttack,
        ).some((number) => index === number)
      ) {
        const damage = Math.max(
          this.bindPers.character.attack
          - this.arrPositionedCharacter[i].character.defence,
          this.bindPers.character.attack * 0.1,
        );
        this.gamePlay.showDamage(index, damage).then(() => {
          this.arrPositionedCharacter[i].character.health -= damage;
          if (this.arrPositionedCharacter[i].character.health <= 0) {
            this.arrPositionedCharacter.splice(i, 1);
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

    for (let i = 0; i < this.arrPositionedCharacter.length; i++) {
      if (typeEnemy.some((num) => this.arrPositionedCharacter[i].character.type === num)) {
        numEnemy.push(this.arrPositionedCharacter[i]);
      }
    }
    for (let i = 0; i < this.arrPositionedCharacter.length; i++) {
      if (typePlayer.some((num) => this.arrPositionedCharacter[i].character.type === num)) {
        numPlayer.push(this.arrPositionedCharacter[i]);
      }
    }
    function random(arr) {
      const rand = Math.floor(Math.random() * arr.length);
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

    if (matched.length <= 0 && activeEnemy) {
      activeEnemy.position = random(rudEnemy);
      this.gamePlay.redrawPositions(this.arrPositionedCharacter);
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
          this.arrPositionedCharacter.splice(delPers, 1);
          this.gameLoop();
          this.gamePlay.redrawPositions(this.arrPositionedCharacter);
        }
        this.gamePlay.redrawPositions(this.arrPositionedCharacter);
      });
    }
  }

  gameLoop() {
    const numEnemy = [];
    const numPlayer = [];
    let playerTeam;
    let enemyTeam;
    const { arrPositionedCharacter } = this;

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
    if (this.start === 0) {
      playerTeam = TeamPlayerRand(1, 1, 2);
      enemyTeam = TeamEnemyrRand(1, 2);
      posCharPlayer();
      posCharEnemy();
      this.start += 1;
    }
    this.arrPositionedCharacter = arrPositionedCharacter;
    numEnem();
    numPlay();
    if (numPlayer.length === 0 && this.start !== 0) {
      GamePlay.showError('ВЫ ПРОИГРАЛИ!');
      this.gamePlay.cellClickListeners = [];
      this.gamePlay.cellEnterListeners = [];
      this.gamePlay.cellLeaveListeners = [];
    }
    if (numEnemy.length === 0 && this.stage < 4) {
      this.stage += 1;
      this.them = themes[this.stage - 1];
      this.gamePlay.drawUi(this.them);
      let counStage = this.stage - 1;
      if (this.stage === 4) {
        counStage = 2;
      }
      for (let i = 0; i < numPlayer.length; i++) {
        const randBoardPlayer = TeamPlayerBoard()[Math.floor(Math.random()
          * TeamPlayerBoard().length)];
        this.score += numPlayer[i].character.health;
        numPlayer[i].position = randBoardPlayer;
        levelUp(numPlayer[i].character);
      }
      playerTeam = TeamPlayerRand(this.stage, this.stage - 1, counStage);
      posCharPlayer();
      enemyTeam = TeamEnemyrRand(this.stage, arrPositionedCharacter.length);
      posCharEnemy();
      numEnem();
      for (let i = 0; i < numEnemy.length; i++) {
        if (numEnemy[i].character.level > 1) {
          numEnemy[i].character.attack *= 1 + ((numEnemy[i].character.level - 1) * 0.8);
          numEnemy[i].character.defence *= 1 + ((numEnemy[i].character.level - 1) * 0.8);
        }
      }
      this.gamePlay.redrawPositions(this.arrPositionedCharacter);
    } else if (numEnemy.length === 0 && this.stage === 4) {
      for (let i = 0; i < numPlayer.length; i++) {
        this.score += numPlayer[i].character.health;
      }
      GamePlay.showError(`Вы выиграли! Набрано очков ${this.score}`);
      this.gamePlay.cellClickListeners = [];
      this.gamePlay.cellEnterListeners = [];
      this.gamePlay.cellLeaveListeners = [];
    }
  }
}
