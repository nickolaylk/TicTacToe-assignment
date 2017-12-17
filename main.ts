import {Cell, Board, Game, Player} from './entities';
import { GameStatus } from './common';

const game = new Game(3, 3);

game.addPlayer(new Player("John Doe", "x"));
game.addPlayer(new Player("Jason Bourne", "o"));

game.board.print();

console.log(GameStatus[game.status]);

game.printSummary();

game.nextMove(0,0);
game.nextMove(0,0);
game.nextMove(1,1);
game.nextMove(0,2);
game.nextMove(2,2);
game.nextMove(0,1);
game.nextMove(2,1);

game.board.print();
game.printSummary();

