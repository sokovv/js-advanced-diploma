import Character from './Character';

class Undead extends Character {
  constructor(level) {
    super(level);
    this.attack = 25;
    this.defence = 25;
    this.rudMove = 2;
    this.rudAttack = 2;
    this.type = 'undead';
  }
}

export default Undead;
