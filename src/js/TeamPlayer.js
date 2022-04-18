import themes from './themes';
import GamePlay from './GamePlay';
import GameStateService from './GameStateService';
import { characterGenerator, generateTeam } from './generators';
import Character from './Character';
import PositionedCharacter from './PositionedCharacter';
import Bowman from './Bowman';
import Daemon from './Daemon';
import Magician from './Magician';
import Swordsman from './Swordsman';
import Undead from './Undead';
import Vampire from './Vampire';
import Team from './Team';

export function TeamPlayerBoard() {
    let randomBoard = [];
    let boardSize = 8
    let len = boardSize * boardSize - 1
    for (let i = 0; i <= len; i++) {
        randomBoard.push(i)
    }

    const randomBoardPlayer = []

    for (let i = 0; i <= randomBoard.length - 1; i++) {
        if (i % boardSize == 0) {
            randomBoardPlayer.push(i)
            randomBoardPlayer.push(i + 1)
        }
    }
    return randomBoardPlayer;
}

export function TeamEnemyBoard() {
    let randomBoard = [];
    let boardSize = 8
    let len = boardSize * boardSize - 1
    for (let i = 0; i <= len; i++) {
        randomBoard.push(i)
    }

    const randomBoardEnemy = []

    for (let i = 0; i <= randomBoard.length - 1; i++) {
        if (i % boardSize == 0 && i != 0) {
            randomBoardEnemy.push(i - 1)
            randomBoardEnemy.push(i - 2)
        }
    }
    randomBoardEnemy.push(len)
    randomBoardEnemy.push(len - 1)
    return randomBoardEnemy;
}

[Bowman, Daemon, Magician, Swordsman, Undead, Vampire]
export function TeamPlayerRand(levelstage, maxLevel, characterCount) {
    if (levelstage === 1) {
        const allowedTypes = [Bowman, Swordsman]
        const teamPlayer = generateTeam(allowedTypes, maxLevel, characterCount)
        return teamPlayer.members;
    } else {
        const allowedTypes = [Bowman, Swordsman, Magician]
        const teamPlayer = generateTeam(allowedTypes, maxLevel, characterCount)
        return teamPlayer.members;
    }

}

export function TeamEnemyrRand(maxLevel, characterCount) {
        const allowedTypes = [Daemon, Undead, Vampire]
        const teamEnemy = generateTeam(allowedTypes, maxLevel, characterCount)
        return teamEnemy.members;   
}
