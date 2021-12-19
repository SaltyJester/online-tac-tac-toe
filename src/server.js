import express from 'express';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import * as path from 'path';

import { TicTacToe, isOutOfBounds } from './game_utils.js';

// console.log("Before or after?")
// import * as test from './experiment.js';
// console.log(test.experimentVar);

// Setting up this web server, as well as Websocket Server.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express(express.static('public'));
const wss = new WebSocketServer({noServer: true});

const server = app.listen(8080);

// Websocket book-keeping
let clients = [];
let nextId = 0;

let game = new TicTacToe();

wss.on('connection', handleConnection);

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, socket => {
        wss.emit('connection', socket, request);
    });
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

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
    else if(clients.length > 2) {
        client.ws.send(produce_describe_state_memo());
    }
}

function handleMessage(client, message)
{
    console.log("Receiving message from client");

    let obj = undefined;
    try {
        obj = JSON.parse(message);
    } catch (e)  {
        notifyUserBadRequest(client, 4000, "Invalid JSON!");
    }

    if(obj.memo === "do_move")
    {
        let result = game.makeMove(obj.data.row, obj.data.col, client.role);
        switch(result)
        {
            case -1:
                notifyUserBadRequest(client, 4001, "Game has ended!");
                break;
            case -2:
                notifyUserBadRequest(client, 4002, "Not your turn!");
                break;
            case -3:
                notifyUserBadRequest(client, 4003, "Out of Bounds!");
                break;
            case -4:
                notifyUserBadRequest(client, 4004, "Spot already taken!");
                break;
        }

        notifyUsersOfState();
    }
    else if(obj.memo === "chat_message")
    {
        broadcastChatMessage(client.id, obj.data.text);
    }
    else if(obj.memo === "ping")
    {
        console.log("Ping received from: " + client);
        client.ws.send("Pong");
    }
    else if(obj.memo === "request_game_state")
    {
        client.ws.send(produce_describe_state_memo());
    }
}

function notifyUserBadRequest(client, status, reason){
    console.log(reason);
}

function notifyUsersOfState()
{
    console.log("Notifying users of new state of board...")
    let message = produce_describe_state_memo();

    for(let i = 0; i < clients.length; i++)
        clients[i].ws.send(message);
}

function produce_describe_state_memo(){
    return JSON.stringify({
        memo: "describe_state",
        data: game
    });
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
        clients[i].ws.send(message);
}

function createSocketObj(ws)
{
    return {
        ws: ws, 
        id: nextId++
    };
}