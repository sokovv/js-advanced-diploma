import GamePlay from '../GamePlay';
import GameController from '../GameController';
import GameStateService from '../GameStateService';
import GameState from '../GameState';

const gamePlay = new GamePlay();
const gameState = new GameState(gamePlay);
const stateService = new GameStateService({});
const gameController = new GameController(gamePlay, stateService, gameState);

jest.mock('../GameStateService');
jest.mock('../GamePlay');
const save = {
  bindPers: 0,
  stage: 1,
  them: 'prairie',
  arrPositionedCharacter: [],
  score: 0,
};

beforeEach(() => {
  jest.resetAllMocks();
});

test('Загрузка', () => {
  gameController.stateService.load.mockReturnValue(save);
  gameController.onLoadGameClick();
  const recieved = {};
  recieved.bindPers = gameState.bindPers;
  recieved.stage = gameState.stage;
  recieved.them = gameState.them;
  recieved.arrPositionedCharacter = gameState.arrPositionedCharacter;
  recieved.score = gameState.score;
  expect(recieved).toEqual(save);
});

test('Ошибка', () => {
  gameController.onLoadGameClick();
  expect(GamePlay.showError).toBeCalledWith('Ошибка загрузки сохранения');
});
