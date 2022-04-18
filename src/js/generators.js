/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */

import Team from './Team';

export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const randNum = Math.floor(Math.random() * allowedTypes.length);
    const Level = Math.max(1, Math.round(Math.random() * maxLevel));
    const unit = new allowedTypes[randNum](Level, allowedTypes[randNum])
    yield unit;
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const gen = characterGenerator(allowedTypes, maxLevel)
  const newTeam = new Team()
  for (let i = 0; i < characterCount; i++) {
    const generate = gen.next().value;
    newTeam.add(generate)
  }
  return newTeam;
}




 // constructor() {
    //     this.members = new Set();

    // }

    // *[Symbol.iterator]() {
    //     for (const item of this.members) {
    //         yield item;
    //     }
    // }


    // add(Character) {
    //     if (this.members.has(Character)) {
    //         throw new Error('Персонаж имеется в команде');
    //     }
    //     this.members.add(Character)

    // }