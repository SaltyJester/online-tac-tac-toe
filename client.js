let websock = new WebSocket("ws://localhost:8080");

// let board = null;

websock.onopen = function (event) {
    // websock.send("Some test message from the client");
};

websock.onmessage = function (event) {
    console.log("Receiving message from server");
    // console.log("I just received: \"" + event.data + "\" from the server!")
    // let obj = JSON.parse(event.data);
    // console.log("X value is: " + obj.x);
    // console.log("Y value is: " + obj.y);
    // console.log(event.data);

    let obj = JSON.parse(event.data);
    if(obj.memo === "describe_role"){
        console.log("I have been assigned as player " + obj.data);
        whoAmI = obj.data;
        if(whoAmI === -1)
        {
            scoreBoard.style.display = "none"; //
        }
        else if(whoAmI === 1)
        {
            homeSymbol.innerText = "X";
            awaySymbol.innerText = "O";
            // turn_indicator_p.style.color = "LawnGreen";
            // turn_indicator_p.innerText = "Your Turn";
        }
        else if(whoAmI === 2)
        {
            homeSymbol.innerText = "O";
            awaySymbol.innerText = "X";
            // turn_indicator_p.style.color = "red";
            // turn_indicator_p.innerText = "Their Turn";
        }
    }
    else if(obj.memo === "describe_state")
    {
        console.log("Server is notifying me of new state...");
        board = obj.data.board;
        currentPlayer = obj.data.currPlayer;
        gameState = obj.data.gameState;

        if(gameState !== 0) {
            

            if(gameState === 3) {
                turn_indicator_p.innerText = "It's a tie!";
            }
            else if(whoAmI !== 1 && whoAmI !== 2) {
                if(gameState === 1){
                    turn_indicator_p.innerText = "Winner is X!";
                }
                else{
                    turn_indicator_p.innerText = "Winner is O!";
                }
            }
            else if(whoAmI === gameState){
                turn_indicator_p.innerText = "You Won!";
            }
            else {
                turn_indicator_p.innerText = "You Lost!";
            }
        }
        else if(whoAmI !== 1 && whoAmI !== 2){
            turn_indicator_p.style.color = "blue";

            if(currentPlayer === 1)
                turn_indicator_p.innerText = "X's Turn";
            else
                turn_indicator_p.innerText = "O's Turn";
        }
        else if(currentPlayer === whoAmI){
            turn_indicator_p.style.color = "LawnGreen";
            turn_indicator_p.innerText = "Your Turn";
        }
        else {
            turn_indicator_p.style.color = "red";
            turn_indicator_p.innerText = "Their Turn";
        }

        drawBoard();
    }
    else if(obj.memo === "chat_message")
    {
        console.log("User with id: " + obj.data.user_id + " said: \"" + obj.data.text + "\"");
    }
};

function setBoardCell(row, col, value)
{
    // board[row][col] = value;
    let message = {
        memo: "do_move",
        data: {
            row: row,
            col: col
        }
    };

    console.log("Sending ")
    websock.send(JSON.stringify(message));
}

function sendChatMessage(text)
{
    let message = {
        memo: "chat_message",
        data: {
            text: text
        }
    };

    websock.send(JSON.stringify(message));
}