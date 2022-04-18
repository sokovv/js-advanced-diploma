import GamePlay from '../GamePlay';
import GameController from '../GameController';

test('Краткая информация', () => {
    const gamePlay = new GamePlay();
    const gameController = new GameController(gamePlay, {});
    gameController.gamePlay.cells[1] = {};

    const character = {
        level: 1,
        attack: 10,
        defence: 40,
        health: 50,
    };
    gameController.gamePlay.showCellTooltip(`${String.fromCodePoint(0x1F396)}:${character.level}${String.fromCodePoint(0x2694)}:${character.attack}${String.fromCodePoint(0x1F6E1)}:${character.defence}${String.fromCodePoint(0x2764)}:${character.health}`, 1);

    const expected = '🎖:1⚔:10🛡:40❤:50';

    expect(gameController.gamePlay.cells[1].title).toBe(expected);
});