import Game from './game.js';
import Control from './control.js';
import {ViewGameField} from './view.js';
import {ViewNextBrick} from './view.js';

const game = new Game();
const view = new ViewGameField(game);
const viewNextBrick = new ViewNextBrick(game);

view.viewGF(game.getState);
viewNextBrick.viewB();

const control = new Control(game, view, viewNextBrick);



