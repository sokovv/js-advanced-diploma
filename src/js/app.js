/**
 * Entry point of app: don't change this
 */
import GamePlay from './GamePlay';
import GameController from './GameController';
import GameStateService from './GameStateService';
import GameState from './GameState';

const gamePlay = new GamePlay();
const gameState = new GameState(gamePlay);
gamePlay.bindToDOM(document.querySelector('#game-container'));

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService, gameState);
gameCtrl.init();

// don't write your code here
