class TicTacToe{
    constructor(){
        this.board = [[0,0,0],[0,0,0],[0,0,0]];
        this.currentPlayer = 1; // player 1 always goes first
        this.gameState = 0; // 0 game in progress, 1 player one wins, 2 player two wins, 3 tie
        this.turnCount = 0; // Only 9 moves per game
    }

    // method will return game state, otherwise will return error code
    makeMove(row, col, player){
        if(row >= this.board.length || row < 0 || col >= this.board[row].length || col < 0){
            return -3; // cell out of bounds
        }
        else if(this.board[row][col] != 0){
            return -1; // cell already taken
        }
        else if(player != this.currentPlayer){
            return -2; // wrong player made move
        }
        this.board[row][col] = player;
        this.currentPlayer = 3 - player; // switch player
        this.turnCount++;

        this.gameState = determineGameState(this.board, this.turnCount);
        return this.gameState;
    }

    getJSON(){
        let gameData = {
            memo: "describe_game",
            data: {
                board: this.board,
                currentPlayer: this.currentPlayer,
                gameState: this.gameState,
                turnCount: this.turnCount
            }
        }
        return JSON.stringify(gameData);
    }
}

function determineGameState(board, turnCount){
    let result = 0;
    
    console.log(board);

    // Checking each of the rows
    if( (result = checkLine(0, 0, 0, 1, 3, board)) != 0) { return result; }
    if( (result = checkLine(1, 0, 0, 1, 3, board)) != 0) { return result; }
    if( (result = checkLine(2, 0, 0, 1, 3, board)) != 0) { return result; }
    
    // Checking each of the cols
    if( (result = checkLine(0, 0, 1, 0, 3, board)) != 0) { return result; }
    if( (result = checkLine(0, 1, 1, 0, 3, board)) != 0) { return result; }
    if( (result = checkLine(0, 2, 1, 0, 3, board)) != 0) { return result; }

    // Checking each of the diagonals
    if( (result = checkLine(0, 0, 1, 1, 3, board)) != 0) { return result; }
    if( (result = checkLine(0, 2, 1, -1, 3, board)) != 0) { return result; }

    if(turnCount == 9)
        return 3;
        
    return 0;
}

function checkLine(sr, sc, dr, dc, len, board)
{
    let val = board[sr][sc];
    for(let i = 1; i < len; i++)
    {
        if(board[sr + dr*i][sc + dc*i] != val)
            return 0;
    }

    return val;
}

module.exports = {
    TicTacToe: TicTacToe
};