import Character from './Character';

class Vampire extends Character {
  constructor(level) {
    super(level);
    this.attack = 40;
    this.defence = 10;
    this.rudMove = 3;
    this.rudAttack = 1;
    this.type = 'vampire';
  }
}

export default Vampire;
