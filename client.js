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
    }
    else if(obj.memo === "describe_state")
    {
        console.log("Server is notifying me of new state...");
        board = obj.data.board;
        currentPlayer = obj.data.currPlayer;
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