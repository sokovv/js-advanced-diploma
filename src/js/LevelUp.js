export default function levelUp(pers) {
  const person = pers;
  person.level += 1;
  person.health = pers.health + 80 >= 100 ? 100 : pers.health + 80;
  person.attack = Math.floor(Math.max(pers.attack, pers.attack * (0.8 + pers.health / 100)));
}
