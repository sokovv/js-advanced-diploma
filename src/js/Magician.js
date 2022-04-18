import Character from './Character';

class Magician extends Character {
  constructor(level) {
    super(level);
    this.attack = 10;
    this.defence = 40;
    this.rudMove = 1;
    this.rudAttack = 3;
    this.type = 'magician';
  }
}

export default Magician;
