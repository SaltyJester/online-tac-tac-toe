let myCanvas = document.getElementById("myCanvas");
let ctx = myCanvas.getContext("2d");

myCanvas.addEventListener('click', clickHandler);

// ctx.fillRect(100, 100, 100, 100);

// let board = new Array(3);
// for(let i = 0; i < 3; i++){
//     board[i] = [0,0,0]
// }

// 0 represents empty space
// 1 represents X
// 2 represents O
let board = [[0,0,0],[0,0,0],[0,0,0]];
let currentPlayer = undefined;
let whoAmI = undefined;
let gameState = 0; // 0 no winners, 1 player one wins, 2 player two wins, 3 tie
let turnNum = 0;

drawBoard();

// ctx.arc(100,100,100,0, 2 * Math.PI);
// ctx.stroke();

function clickHandler(event){
    let cW = myCanvas.width/3;
    let cH = myCanvas.height/3;

    // console.log(event.clientX - 10, event.clientY - 10);
    let rect = event.target.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    let row = Math.floor(y/cH);
    let col = Math.floor(x/cW);
    
    if(board[row][col] != 0 || gameState != 0)
        return;

    // board[row][col] = currentPlayer;
    // currentPlayer = 1 - currentPlayer;
    // turnNum++;
    // drawBoard();

    // gameState = determineGameState();
    // if(gameState != 0)
    //     announceResult();

    setBoardCell(row, col);
}

function drawBoard() {
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
    let cW = myCanvas.width/3;
    let cH = myCanvas.height/3;

    // draw board
    ctx.beginPath();
    for(let i = 1; i <= 2; i++){
        ctx.moveTo(i*cW, 0);
        ctx.lineTo(i*cW, cH*3);

        ctx.moveTo(0, i*cH);
        ctx.lineTo(cW*3, i*cH);
    }
    ctx.stroke();
    

    // draw X and O
    for(let r = 0; r < 3; r++){
        for(let c = 0; c < 3; c++){
            if(board[r][c] == 1){
                ctx.beginPath();
                ctx.moveTo(c*cW, r*cH);
                ctx.lineTo((c+1)*cW, (r+1)*cH);

                ctx.moveTo((c+1)*cW, r*cH);
                ctx.lineTo(c*cW, (r+1)*cH);
                ctx.stroke();
            }
            else if(board[r][c] == 2){
                ctx.beginPath();
                ctx.arc((c+0.5)*cW, (r+0.5)*cH, cW/2, 0, 2*Math.PI);
                ctx.stroke();
            }
        }
    }
}

function determineGameState()
{
    let result = 0;

    // Checking each of the rows
    if( (result = checkLine(0, 0, 0, 1, 3)) != 0) { return result; }
    if( (result = checkLine(1, 0, 0, 1, 3)) != 0) { return result; }
    if( (result = checkLine(2, 0, 0, 1, 3)) != 0) { return result; }
    
    // Checking each of the cols
    if( (result = checkLine(0, 0, 1, 0, 3)) != 0) { return result; }
    if( (result = checkLine(0, 1, 1, 0, 3)) != 0) { return result; }
    if( (result = checkLine(0, 2, 1, 0, 3)) != 0) { return result; }

    // Checking each of the diagonals
    if( (result = checkLine(0, 0, 1, 1, 3)) != 0) { return result; }
    if( (result = checkLine(0, 2, 1, -1, 3)) != 0) { return result; }

    if(turnNum == 9)
        return 3;
        
    return 0;
}

// 0 -> no winner in this line
// 1 -> player one wins this line
// 2 -> player two wins this line
function checkLine(sr, sc, dr, dc, len)
{
    let val = board[sr][sc];
    for(let i = 1; i < len; i++)
    {
        if(board[sr + dr*i][sc + dc*i] != val)
            return 0;
    }

    return val;
}

function announceResult()
{
    let announcement = document.createElement("p");
    let str = "This is new.";

    if(gameState != 3){
        str = "Player " + gameState + " has won!"
    }
    else{
        str = "Game ended in a tie!"
    }

    const node = document.createTextNode(str);
    announcement.appendChild(node);
    document.body.appendChild(announcement);
}