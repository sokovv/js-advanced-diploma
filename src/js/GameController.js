
import GamePlay from './GamePlay';
import GameState from './GameState';
import PositionedCharacter from './PositionedCharacter';
import cursors from './cursors';
import { TeamPlayerBoard, TeamEnemyBoard, TeamPlayerRand, TeamEnemyrRand } from './TeamPlayer';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.bindPers = 0;
    this.move = 0;
    this.stage = 1;
    this.them = 'prairie';
    this.start = 0;
    this.score = 0;
    this.arrPositionedCharacter = [];
    this.numEnemy;
    this.numPlayer;
  }

  init() {
    this.gameLoop()
    this.gamePlay.drawUi(this.them)
    this.gamePlay.redrawPositions(this.arrPositionedCharacter);
    this.addListener()
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
    this.arrPositionedCharacter = []
    this.stage = 1;
    this.start = 0;
    this.them = 'prairie';
    this.init();
  }

  onSaveGameClick() {
    const saveGame = {
      bindPers: this.bindPers,
      stage: this.stage,
      them: this.them,
      arrPositionedCharacter: this.arrPositionedCharacter,
      numEnemy: this.numEnemy,
      numPlayer: this.numPlayer,
      score: this.score
    };
    this.stateService.save(GameState.from(saveGame));
  }

  onLoadGameClick() {
    const load = this.stateService.load();
    if (typeof (load) === 'object') {
      this.bindPers = load.bindPers;
      this.stage = load.stage;
      this.them = load.them;
      this.arrPositionedCharacter = load.arrPositionedCharacter;
      this.numEnemy = load.numEnemy;
      this.numPlayer = load.numPlayer;
      this.gamePlay.drawUi(this.them);
      this.gamePlay.redrawPositions(this.arrPositionedCharacter);
      this.score = load.score;
    } else {
      GamePlay.showError('Ошибка загрузки сохранения');
    }
  }

  nextMove() {
    this.move = this.move === 0 ? 1 : 0;
  }

  onCellClick(index) {
    let arr = ["bowman", 'swordsman', 'magician']
    let arr2 = ["daemon", 'undead', 'vampire']
    let arrCell = this.gamePlay.cells;
    arrCell.forEach(element => element.classList.remove("selected"));
    this.attack(index)
    for (let i = 0; i < this.arrPositionedCharacter.length; i++) {
      let num = this.arrPositionedCharacter[i].character.type
      if (this.arrPositionedCharacter[i].position === index && (num == arr[0] || num == arr[1] || num == arr[2])) {
        this.gamePlay.selectCell(index, 'yellow');
        this.bindPers = this.arrPositionedCharacter[i]
      }
      if (this.arrPositionedCharacter[i].position === index && (num == arr2[0] || num == arr2[1] || num == arr2[2]) && this.bindPers == 0) {
        GamePlay.showError('Это вражеский персонаж, им нельзя играть')
      }
    }

    if (this.bindPers != 0 && this.bindPers.character.type == 'magician') {
      const g = this.moveRud(this.bindPers.position, 1)
      for (let i = 0; i < g.length; i++) {
        if (index == g[i]
          && this.arrPositionedCharacter.every((num) => {
            return index != num.position;
          })) {
          this.bind(index)
        }
      }
    }
    if (this.bindPers != 0 && this.bindPers.character.type == 'bowman') {
      const g = this.moveRud(this.bindPers.position, 2)
      for (let i = 0; i < g.length; i++) {
        if (index == g[i]
          && this.arrPositionedCharacter.every((num) => {
            return index != num.position;
          })) {
          this.bind(index)
        }
      }
    }
    if (this.bindPers != 0 && this.bindPers.character.type == 'swordsman') {
      const g = this.moveRud(this.bindPers.position, 3)
      for (let i = 0; i < g.length; i++) {
        if (index == g[i]
          && this.arrPositionedCharacter.every((num) => {
            return index != num.position;
          })) {
          this.bind(index)
        }
      }
    }
  }

  onCellEnter(index) {
    let arr = ["bowman", 'swordsman', 'magician']
    let arr2 = ["daemon", 'undead', 'vampire']

    if (this.bindPers != 0 && this.bindPers.character.type == 'magician') {
      const g = this.moveRud(this.bindPers.position, 1)
      for (let i = 0; i < g.length; i++) {
        if (index == g[i]
          && index != this.bindPers.position
        ) {
          this.gamePlay.setCursor(cursors.pointer)
          this.gamePlay.selectCell(index, 'green');
        }
      }
    }
    if (this.bindPers != 0 && this.bindPers.character.type == "bowman") {
      const g = this.moveRud(this.bindPers.position, 2)
      for (let i = 0; i < g.length; i++) {
        if (index == g[i]
          && index != this.bindPers.position
        ) {
          this.gamePlay.setCursor(cursors.pointer)
          this.gamePlay.selectCell(index, 'green');
        }
      }
    }
    if (this.bindPers != 0 && this.bindPers.character.type == 'swordsman') {
      const g = this.moveRud(this.bindPers.position, 3)
      for (let i = 0; i < g.length; i++) {
        if (index == g[i]
          && index != this.bindPers.position
        ) {
          this.gamePlay.setCursor(cursors.pointer)
          this.gamePlay.selectCell(index, 'green');
        }
      }
    }
    for (let i = 0; i < this.arrPositionedCharacter.length; i++) {
      if (this.arrPositionedCharacter[i].position === index) {
        this.gamePlay.showCellTooltip(`${String.fromCodePoint(0x1F396)}:${this.arrPositionedCharacter[i].character.level} ${String.fromCodePoint(0x2694)}:${this.arrPositionedCharacter[i].character.attack} ${String.fromCodePoint(0x1F6E1)}:${this.arrPositionedCharacter[i].character.defence} ${String.fromCodePoint(0x2764)}:${this.arrPositionedCharacter[i].character.health}`, index);
      }
    }
    for (let i = 0; i < this.arrPositionedCharacter.length; i++) {
      let num = this.arrPositionedCharacter[i].character.type
      if (this.arrPositionedCharacter[i].position === index && (num == arr[0] || num == arr[1] || num == arr[2])) {
        this.gamePlay.setCursor(cursors.pointer)
      }

      if (this.arrPositionedCharacter[i].position === index && (num == arr2[0] || num == arr2[1] || num == arr2[2]) && this.bindPers != 0
        && (this.bindPers.character.type == 'swordsman' && this.attackRud(this.bindPers.position, 1).some((num) => {
          return index == num;
        })
          || this.bindPers.character.type == 'bowman'
          && this.attackRud(this.bindPers.position, 2).some((num) => {
            return index == num;
          })
          || this.bindPers.character.type == 'magician' && this.attackRud(this.bindPers.position, 3).some((num) => {
            return index == num;
          })
        )) {
        this.gamePlay.setCursor(cursors.crosshair)
        this.gamePlay.selectCell(index, 'red');
      }
      if (this.arrPositionedCharacter[i].position === index && (num == arr2[0] || num == arr2[1] || num == arr2[2]) && this.bindPers != 0
        && (this.bindPers.character.type == 'bowman' && this.attackRud(this.bindPers.position, 2).every((num) => {
          return index != num;
        }) || this.bindPers.character.type == 'magician' && this.attackRud(this.bindPers.position, 3).every((num) => {
          return index != num;
        }) || this.bindPers.character.type == 'swordsman' && this.attackRud(this.bindPers.position, 1).every((num) => {
          return index != num;
        })
        )) {
        this.gamePlay.setCursor(cursors.notallowed)
        this.gamePlay.deselectCell(index);
      }

    }
  }

  onCellLeave(index) {
    let arr2 = ["daemon", 'undead', 'vampire']
    this.gamePlay.setCursor(cursors.auto)
    if (index != this.bindPers.position) {
      this.gamePlay.deselectCell(index);
    }
    for (let i = 0; i < this.arrPositionedCharacter.length; i++) {
      let num = this.arrPositionedCharacter[i].character.type
      if (this.arrPositionedCharacter[i].position === index && (num == arr2[0] || num == arr2[1] || num == arr2[2])) {
        this.gamePlay.deselectCell(index);
      }
    }
  }

  bind(index) {
    this.bindPers.position = index;
    this.gamePlay.selectCell(index, 'yellow');
    this.gamePlay.redrawPositions(this.arrPositionedCharacter)
    this.enemyAction()
  }

  arrBoard() {
    const arr = [];
    for (let i = 0; i < 64; i++) {
      arr.push(i)
    }
    return arr;
  }

  attack(index) {

    const attackSwoRud = this.attackRud(this.bindPers.position, 1)
    const attackBowRud = this.attackRud(this.bindPers.position, 2)
    const attackMagRud = this.attackRud(this.bindPers.position, 3)

    let arr2 = ["daemon", 'undead', 'vampire']
    for (let i = 0; i < this.arrPositionedCharacter.length; i++) {
      let num = this.arrPositionedCharacter[i].character.type
      if (this.bindPers != 0 && this.arrPositionedCharacter[i].position === index && (num == arr2[0] || num == arr2[1] || num == arr2[2])
        && (this.bindPers.character.type == 'swordsman' && attackSwoRud.some((num) => {
          return this.arrPositionedCharacter[i].position == num;
        })
          || this.bindPers.character.type == 'bowman' && attackBowRud.some((num) => {
            return index == num;
          })
          || this.bindPers.character.type == 'magician' && attackMagRud.some((num) => {
            return this.arrPositionedCharacter[i].position == num;
          })
        )) {
        const damage = Math.max(this.bindPers.character.attack - this.arrPositionedCharacter[i].character.defence, this.bindPers.character.attack * 0.1)
        this.gamePlay.showDamage(index, damage).then(() => {
          this.arrPositionedCharacter[i].character.health -= damage;
          if (this.arrPositionedCharacter[i].character.health <= 0) {
            this.arrPositionedCharacter.splice(i, 1)
            this.gameLoop()
          }
          this.enemyAction()
        });
      }
    }
  }
  attackRud(index, radius) {
    const Steps = new Set();
    let left = index;
    let right = index;
    let start = null;
    while (left > index - radius && left % 8 !== 0) {
      left -= 1;
    }
    while (right < index + radius && (right + 1) % 8 !== 0) {
      right += 1;
    }
    start = left;
    while (start <= right) {
      let topValues = start
      let bottomValues = start;
      Steps.add(start);
      while (topValues > start - radius * 8 && topValues - 8 >= 0) {
        topValues -= 8;
        Steps.add(topValues);
      }
      while (bottomValues < start + radius * 8 && bottomValues + 8 < 64) {
        bottomValues += 8;
        Steps.add(bottomValues);
      }
      start += 1;
    }

    return [...Steps].sort((a, b) => a - b);

  }
  moveRud(index, radius) {
    const Steps = new Set();
    let left = index;
    let right = index;
    let leftTop = index;
    let RightBot = index;
    let RightTop = index;
    let LeftBot = index;

    while (left > index - radius && left % 8 !== 0) {
      left -= 1;
      leftTop -= 9;
      LeftBot += 7;
    }
    while (right < index + radius && (right + 1) % 8 !== 0) {
      right += 1;
      RightTop -= 7
      RightBot += 9
    }

    function* makeRangeIterator(start = 0, end = 100, step = 1) {
      let iterationCount = 0;
      for (let i = start; i <= end; i += step) {
        iterationCount++;
        yield i;
      }
      return iterationCount;
    }
    let diagLeft;
    let med;
    let vert;
    let diagRight;

    diagLeft = makeRangeIterator(leftTop, RightBot, 9);
    med = makeRangeIterator(left, right);
    vert = makeRangeIterator(index - 8 * radius, index + 8 * radius, 8);
    diagRight = makeRangeIterator(RightTop, LeftBot, 7);


    for (let i of med) {
      Steps.add(i);
    }
    for (let i of vert) {
      Steps.add(i);
    }

    for (let i of diagLeft) {
      Steps.add(i);
    }
    for (let i of diagRight) {
      Steps.add(i);
    }

    return [...Steps].sort((a, b) => a - b);
  }

  enemyAction() {
    let arr = ["bowman", 'swordsman', 'magician']
    let arr2 = ["daemon", 'undead', 'vampire']
    let numEnemy = [];
    let numPlayer = [];

    for (let i = 0; i < this.arrPositionedCharacter.length; i++) {
      if (arr2.some((num) => this.arrPositionedCharacter[i].character.type == num))
        numEnemy.push(this.arrPositionedCharacter[i])
    }
    for (let i = 0; i < this.arrPositionedCharacter.length; i++) {
      if (arr.some((num) => this.arrPositionedCharacter[i].character.type == num))
        numPlayer.push(this.arrPositionedCharacter[i])
    }
    function random(arr) {
      let rand = Math.floor(Math.random() * arr.length);
      return arr[rand];
    }

    let activeEnemy = random(numEnemy)
    let rudEnemy = [];
    let rudEnemyAttack = [];
    if (activeEnemy) {
      rudEnemy = this.moveRud(activeEnemy.position, activeEnemy.character.rudMove).filter(item => 0 < item && item < 64);
      rudEnemyAttack = this.attackRud(activeEnemy.position, activeEnemy.character.rudAttack).filter(item => 0 < item && item < 64);
    }
    let matched = numPlayer.filter(el => rudEnemyAttack.indexOf(el.position) > -1);

    if (matched.length <= 0 && activeEnemy) {
      activeEnemy.position = random(rudEnemy);
      this.gamePlay.redrawPositions(this.arrPositionedCharacter)
    } else if (activeEnemy) {
      let activePers = random(matched)
      const damage = Math.max(activeEnemy.character.attack - activePers.character.defence, activeEnemy.character.attack * 0.1)
      this.gamePlay.showDamage(activePers.position, damage).then(() => {
        activePers.character.health -= damage
        if (activePers.character.health <= 0) {
          let delPers = numPlayer.findIndex(item => item.character.health <= 0);
          this.arrPositionedCharacter.splice(delPers, 1)
          this.gameLoop()
          this.gamePlay.redrawPositions(this.arrPositionedCharacter)
        }
        this.gamePlay.redrawPositions(this.arrPositionedCharacter)
      });
    }
  }

  gameLoop() {
    let arr = ["bowman", 'swordsman', 'magician']
    let arr2 = ["daemon", 'undead', 'vampire']
    let numEnemy = [];
    let numPlayer = [];
    let playerTeam;
    let enemyTeam;
    let arrPositionedCharacter = this.arrPositionedCharacter

    function posCharPlayer() {
      for (let i = 0; i < playerTeam.length; i++) {
        const randBoardPlayer = TeamPlayerBoard()[Math.floor(Math.random() * TeamPlayerBoard().length)];
        const positionedCharacter = new PositionedCharacter(playerTeam[i], randBoardPlayer)
        arrPositionedCharacter.push(positionedCharacter)
      }
    }
    function posCharEnemy() {
      for (let i = 0; i < enemyTeam.length; i++) {
        const randBoardEnemy = TeamEnemyBoard()[Math.floor(Math.random() * TeamEnemyBoard().length)];
        const positionedCharacter = new PositionedCharacter(enemyTeam[i], randBoardEnemy)
        arrPositionedCharacter.push(positionedCharacter)
      }
    }

    function numEnem() {
      for (let i = 0; i < arrPositionedCharacter.length; i++) {
        if (arr2.some((num) => arrPositionedCharacter[i].character.type == num))
          numEnemy.push(arrPositionedCharacter[i])
      }
    }
    function numPlay() {
      for (let i = 0; i < arrPositionedCharacter.length; i++) {
        if (arr.some((num) => arrPositionedCharacter[i].character.type == num))
          numPlayer.push(arrPositionedCharacter[i])
      }
    }

    if (this.start == 0) {
      playerTeam = TeamPlayerRand(1, 1, 2)
      enemyTeam = TeamEnemyrRand(1, 2)
      posCharPlayer()
      posCharEnemy()
      this.start += 1;
    }

    this.arrPositionedCharacter = arrPositionedCharacter;
    numEnem();
    numPlay();

    if (numPlayer.length == 0 && this.start != 0) {
      GamePlay.showError('ВЫ ПРОИГРАЛИ!')
      this.gamePlay.cellClickListeners = [];
      this.gamePlay.cellEnterListeners = [];
      this.gamePlay.cellLeaveListeners = [];
    }

    if (numEnemy.length == 0 && this.stage < 4) {
      this.stage += 1;
      if (this.stage == 1) {
        this.them = 'prairie'
      }
      if (this.stage == 2) {
        this.them = 'desert'
      }
      if (this.stage == 3) {
        this.them = 'arctic'
      }
      if (this.stage == 4) {
        this.them = 'mountain'
      }

      this.gamePlay.drawUi(this.them)
      let counStage = this.stage - 1;
      if (this.stage == 4) {
        counStage = 2
      }

      for (let i = 0; i < numPlayer.length; i++) {
        const randBoardPlayer = TeamPlayerBoard()[Math.floor(Math.random() * TeamPlayerBoard().length)];
        this.score += numPlayer[i].character.health;
        numPlayer[i].position = randBoardPlayer
        this.levelUp(numPlayer[i].character)
      }
      playerTeam = TeamPlayerRand(this.stage, this.stage - 1, counStage)
      posCharPlayer()
      enemyTeam = TeamEnemyrRand(this.stage, arrPositionedCharacter.length)
      posCharEnemy()
      numEnem()
      for (let i = 0; i < numEnemy.length; i++) {
        if (numEnemy[i].character.level > 1) {
          numEnemy[i].character.attack *= 1 + ((numEnemy[i].character.level - 1) * 0.8)
          numEnemy[i].character.defence *= 1 + ((numEnemy[i].character.level - 1) * 0.8)
        }
      }
      this.gamePlay.redrawPositions(this.arrPositionedCharacter);
    }
    else if (numEnemy.length == 0 && this.stage == 4) {
      for (let i = 0; i < numPlayer.length; i++) {
        this.score += numPlayer[i].character.health;
      }
      GamePlay.showError(`Вы выиграли! Набрано очков ${this.score}`)
      this.gamePlay.cellClickListeners = [];
      this.gamePlay.cellEnterListeners = [];
      this.gamePlay.cellLeaveListeners = [];

    }
  }
  levelUp(pers) {
    pers.level += 1;
    pers.health = pers.health + 80 >= 100 ? 100 : pers.health + 80;
    pers.attack = Math.floor(Math.max(pers.attack, pers.attack * (0.8 + pers.health / 100)));
  }
}
