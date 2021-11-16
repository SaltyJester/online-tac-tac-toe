const {TicTacToe} = require('./util/tic-tac-toe');

let game = new TicTacToe();
let result = game.makeMove(-1,0,2);
console.log(result);