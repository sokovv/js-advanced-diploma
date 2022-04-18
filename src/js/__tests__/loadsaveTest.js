import GamePlay from '../GamePlay';
import GameController from '../GameController';
import GameStateService from '../GameStateService';

const gamePlay = new GamePlay();
const stateService = new GameStateService({});
const gameController = new GameController(gamePlay, stateService);

jest.mock('../GameStateService');
jest.mock('../GamePlay');
const save = {
    bindPers: 0,
    stage: 1,
    them: 'prairie',
    arrPositionedCharacter: [],
    score: 0
};

beforeEach(() => {
  jest.resetAllMocks();
});

test('Загрузка', () => {
  gameController.stateService.load.mockReturnValue(save);
  gameController.onLoadGameClick();
  const recieved = {};
  recieved.bindPers = gameController.bindPers;
  recieved.stage = gameController.stage;
  recieved.them = gameController.them;
  recieved.arrPositionedCharacter = gameController.arrPositionedCharacter;
  recieved.score = gameController.score;
  expect(recieved).toEqual(save);
});

test('Ошибка', () => {
  gameController.onLoadGameClick();
  expect(GamePlay.showError).toBeCalledWith('Ошибка загрузки сохранения');
});
