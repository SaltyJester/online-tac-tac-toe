let numRows = 3;
let numCols = 3;

class TicTacToe{
    constructor(){
        // this.board = [[0,0,0],[0,0,0],[0,0,0]];
        this.board = new Array(numRows);
        for(let i = 0; i < numRows; i++)
        {
            this.board[i] = new Array(numCols);
            for(let j = 0; j < numCols; j++)
                this.board[i][j] = 0;
        }

        this.currentPlayer = 1; // player 1 always goes first
        this.gameState = 0; // 0 game in progress, 1 player one wins, 2 player two wins, 3 tie
        this.turnNum = 0; // Only 9 moves per game
    }

    makeMove(row, col, player)
    {
        if(this.gameState !== 0)
            return -1;

        if(this.currentPlayer !== player)
            return -2;

        if(isOutOfBounds(row, col))
            return -3;

        if(this.isTaken(row, col))
            return -4;

        this.board[row][col] = player;
        this.currentPlayer = 3 - this.currentPlayer;
        this.turnNum++;
        this.gameState = this.determineGameState();

        return 0;
    }

    determineGameState() {
        let result = 0;

        // Checking each of the rows
        if( (result = this.checkLine(0, 0, 0, 1, 3)) != 0) { return result; }
        if( (result = this.checkLine(1, 0, 0, 1, 3)) != 0) { return result; }
        if( (result = this.checkLine(2, 0, 0, 1, 3)) != 0) { return result; }
        
        // Checking each of the cols
        if( (result = this.checkLine(0, 0, 1, 0, 3)) != 0) { return result; }
        if( (result = this.checkLine(0, 1, 1, 0, 3)) != 0) { return result; }
        if( (result = this.checkLine(0, 2, 1, 0, 3)) != 0) { return result; }
    
        // Checking each of the diagonals
        if( (result = this.checkLine(0, 0, 1, 1, 3)) != 0) { return result; }
        if( (result = this.checkLine(0, 2, 1, -1, 3)) != 0) { return result; }
    
        if(this.turnNum == 9)
            return 3;
            
        return 0;
    }

    // 0 -> no winner in this line
    // 1 -> player one wins this line
    // 2 -> player two wins this line
    checkLine(sr, sc, dr, dc, len)
    {
        let val = this.board[sr][sc];
        for(let i = 1; i < len; i++)
        {
            if(this.board[sr + dr*i][sc + dc*i] != val)
                return 0;
        }

        return val;
    }

    isTaken(row, col)
    {
        return this.board[row][col] !== 0;
    }
}

function isOutOfBounds(row, col)
{
    return row >= numRows || row < 0 || col >= numCols || col < 0;
}

export {
    TicTacToe,
    isOutOfBounds
}