import Character from './Character';

class Daemon extends Character {
  constructor(level) {
    super(level);
    this.attack = 10;
    this.defence = 40;
    this.rudMove = 1;
    this.rudAttack = 3;
    this.type = 'daemon';
  }
}

export default Daemon;
