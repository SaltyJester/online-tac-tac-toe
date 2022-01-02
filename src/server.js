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
app.use(express.json());
const wss = new WebSocketServer({noServer: true});

const server = app.listen(8080);

// Websocket book-keeping
let lobbies = {};
let nextLobbyId = 0;

wss.on('connection', handleConnection);

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, socket => {
        wss.emit('connection', socket, request);
    });
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// /create_lobby
app.post('/create_lobby', (req, res) => {
    // request should look like... {lobbyName: <>}
    // loby should look like... {lobbyId: <>, lobbyName: <>, clients: <>, nextClientId: <>}

    // TODO: Reject requests that lack a lobbyName or lobbyOwner. Do extra
    // validation as well.

    console.log("Received create lobby request: " + JSON.stringify(req.body));
    console.log("Lobby Name given: " + req.body.lobbyName);

    let lobby = {
        lobbyId: nextLobbyId, 
        lobbyName: req.body.lobbyName,
        clients: [],
        nextClientId: 0,
        game: new TicTacToe()
    };

    lobbies[nextLobbyId++] = lobby;
    res.status(201).send();
});

app.get('/list_lobbies', (req, res) => {
    // TODO: Allow query parameters to get a range of lobbies,
    // pagination of the list of lobbies.

    let result = [];
    for(const [lobbyId, lobby] of Object.entries(lobbies)) {
        result.push({
            lobbyId,
            lobbyName: lobby.lobbyName,
            playerCount: lobby.clients.length
        });
    }

    res.json(result);
});

// TODO: Maybe validate the 'file' path param to check if it is a valid
// filename within a pre-approved list of files. We can programmatically generate
// this list by looking at what files are in the 'public' directory.
app.get('/public/:file', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/' + req.params.file));
});

app.get('/lobbies/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/game.html'));
});

function handleConnection(ws)
{
    let client = createSocketObj(ws);
    ws.on('message', (message) => handleMessage(client, message));
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
    let lobbyId = obj.lobbyId;

    if(!(lobbyId in lobbies))
    {
        notifyUserBadRequest(client, 4010, "Lobby ID required");
    }
    else if(obj.memo === "register_into_lobby")
    {
        let lobby = lobbies[lobbyId];
        let clients = lobby.clients;
        client.lobbyId = lobbyId;
        client.id = lobby.nextClientId++;        

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

        client.ws.send(JSON.stringify({
            memo: "describe_role",
            data: client.role
        }));

        if(clients.length == 2){
            notifyUsersOfState(lobbyId);
        }
        else if(clients.length > 2) {
            client.ws.send(produce_describe_state_memo(lobbyId));
        }
    }
    else if(obj.memo === "do_move")
    {
        let result = lobbies[lobbyId].game.makeMove(obj.data.row, obj.data.col, client.role);
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

        notifyUsersOfState(lobbyId);
    }
    else if(obj.memo === "chat_message")
    {
        broadcastChatMessage(lobbyId, client.id, obj.data.text);
    }
    else if(obj.memo === "ping")
    {
        console.log("Ping received from: " + JSON.stringify(client));
        client.ws.send("Pong");
    }
    else if(obj.memo === "request_game_state")
    {
        client.ws.send(produce_describe_state_memo(lobbyId));
    }
}

function notifyUserBadRequest(client, status, reason){
    console.log(reason);
}

function notifyUsersOfState(lobbyId)
{
    console.log("Notifying users of new state of board...")
    let message = produce_describe_state_memo(lobbyId);

    let clients = lobbies[lobbyId].clients;

    for(let i = 0; i < clients.length; i++)
        clients[i].ws.send(message);
}

function produce_describe_state_memo(lobbyId){
    return JSON.stringify({
        memo: "describe_state",
        data: lobbies[lobbyId].game
    });
}

function broadcastChatMessage(lobbyId, user_id, text)
{
    let message = JSON.stringify({
        memo: "chat_message",
        data: {
            user_id: user_id,
            text: text
        }
    });

    let clients = lobbies[lobbyId].clients;

    for(let i = 0; i < clients.length; i++)
        clients[i].ws.send(message);
}

function createSocketObj(ws)
{
    return {
        ws: ws, 
        id: undefined,
        lobbyId: undefined,
        role: undefined
    };
}