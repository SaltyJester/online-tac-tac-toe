import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
let clients = [];
let nextId = 0;

let board = [[0,0,0],[0,0,0],[0,0,0]];
let currPlayer = 1;

wss.on('connection', handleConnection);

function handleConnection(ws)
{
    let client = createSocketObj(ws);
    if(clients.length == 0)
    {
        client.role = Math.floor(Math.random() * 2) + 1;
    }
    else if(clients.length == 1)
    {
        client.role = 3 - clients[0].role;
    }
    else{
        client.role = -1;
    }
    clients.push(client);
    ws.on('message', (message) => handleMessage(client, message));

    ws.send(JSON.stringify({
        memo: "describe_role",
        data: client.role
    }));

    if(clients.length == 2){
        notifyUsersOfState();
    }
}

function handleMessage(client, message)
{
    console.log("Receiving message from client");

    let obj = JSON.parse(message);
    if(obj.memo === "do_move")
    {
        if(client.role !== currPlayer){
            notifyUserBadRequest(client, 4000, "Not your turn!");
            return;
        }
        let r = obj.data.row;
        let c = obj.data.col;
        if(r >= board.length || r < 0 || c >= board[r].length || c < 0){
            notifyUserBadRequest(client, 4001, "Out of Bounds!");
            return;
        }
        console.log("Client making a move...");
        if(board[obj.data.row][obj.data.col] !== 0){
            notifyUserBadRequest(client, 4002, "Spot already taken!");
            return;
        }
        board[obj.data.row][obj.data.col] = client.role;
        currPlayer = 3 - currPlayer;
        notifyUsersOfState();
    }
    else if(obj.memo === "chat_message")
    {
        broadcastChatMessage(client.id, obj.data.text);
    }
}

function notifyUserBadRequest(client, status, reason){
    console.log(reason);
}

function notifyUsersOfState()
{
    console.log("Notifying users of new state of board...")
    let message = JSON.stringify({
        memo: "describe_state",
        data: {
            board: board,
            currPlayer: currPlayer
        }
    });

    for(let i = 0; i < clients.length; i++)
        clients[i].ws.send(message);
}

function broadcastChatMessage(user_id, text)
{
    let message = JSON.stringify({
        memo: "chat_message",
        data: {
            user_id: user_id,
            text: text
        }
    });

    for(let i = 0; i < clients.length; i++)
        if(clients[i].id != user_id)
            clients[i].ws.send(message);
}

function createSocketObj(ws)
{
    return {
        ws: ws, 
        id: nextId++
    };
}