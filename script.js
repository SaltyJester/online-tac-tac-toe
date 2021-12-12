let myCanvas = document.getElementById("myCanvas");
let ctx = myCanvas.getContext("2d");

let scoreBoard = document.getElementById("score_board");
let homeSymbol = document.getElementById("home_symbol");
let awaySymbol = document.getElementById("away_symbol");
let turn_indicator_p = document.getElementById("turn_indicator");
let chatInput = document.getElementById("chatInput");

myCanvas.addEventListener('click', clickHandler);
chatInput.addEventListener('keyup', handleChatInput);


// ctx.fillRect(100, 100, 100, 100);

// let board = new Array(3);
// for(let i = 0; i < 3; i++){
//     board[i] = [0,0,0]
// }

// 0 represents empty space
// 1 represents X
// 2 represents O
// let board = [[0,0,0],[0,0,0],[0,0,0]];
let board = null;
let currentPlayer = undefined;
let whoAmI = undefined;
let gameState = 0; // 0 no winners, 1 player one wins, 2 player two wins, 3 tie

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
    if(board === null)
        return;

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

function updateChatWindow(user_id, text)
{
    let chatWindow = document.getElementById("chatWindow");
    chatWindow.value += "\n" + user_id + ": " + text;
}

function handleChatInput(evt){
    if(evt.keyCode == 13){
        sendChatMessage(evt.target.value);
        evt.target.value = "";
    }
}