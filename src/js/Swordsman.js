import Character from './Character';

class Swordsman extends Character {
  constructor(level) {
    super(level);
    this.attack = 40;
    this.defence = 10;
    this.rudMove = 3;
    this.rudAttack = 1;
    this.type = 'swordsman';
  }
}

export default Swordsman;
