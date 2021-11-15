class TicTacToe{
    constructor(){
        this.board = [[0,0,0],[0,0,0],[0,0,0]];
        this.currentPlayer = undefined;
        this.gameState = 0; // 0 no winners, 1 player one wins, 2 player two wins, 3 tie
        this.turnCount = 0; // Only 9 moves per game
    }
}

module.exports = {
    TicTacToe: TicTacToe
};