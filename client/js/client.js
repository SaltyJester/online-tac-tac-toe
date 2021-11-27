const ws = new WebSocket('ws://localhost:8080');

let myCanvas = document.getElementById("myCanvas");
let ctx = myCanvas.getContext("2d");
myCanvas.addEventListener('click', clickHandler);

let role = undefined;
let gameData = undefined;

ws.onmessage = (event) => {
    console.log("Receiving message from the server!");

    let msg = JSON.parse(event.data);
    if(msg.memo == "describe_role"){
        role = msg.data.role;
        console.log("I have been designated as player: " + role);
    }
    if(msg.memo == "describe_game"){
        // should call a function to update the board GUI
        gameData = msg.data;
        drawBoard();
    }
}

function clickHandler(event){
    console.log('clicking!!!')
    let cW = myCanvas.width/3;
    let cH = myCanvas.height/3;

    let rect = event.target.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    let row = Math.floor(y/cH);
    let col = Math.floor(x/cW);

    console.log(row, col);

    doMove(col, row);
}

function drawBoard() {
    let board = gameData.board;
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

function doMove(row, col){
    let move = {
        memo: "do_move",
        row,
        col
    }

    ws.send(JSON.stringify(move));
}

function sendMessage(msg){
    ws.send(msg);
}