const {WebSocketServer} = require('ws');
const {TicTacToe} = require('./util/tic-tac-toe');

let game = new TicTacToe();
let clients = [];
let nextId = 0;
let port = 8080;
const wss = new WebSocketServer({ port }, ()=>{
    console.log("Starting WebSocketServer on port " + port);
});

wss.on('connection', (webSocket) => {
    let client = handleConnection(webSocket);
    webSocket.on('message', (msg) => {
        console.log("Receiving message from client " + client.id);
        let data = JSON.parse(msg);

        if(data.memo == "do_move"){
            game.makeMove(data.row, data.col, client.role);
            for(let i = 0; i < clients.length; i++){
                clients[i].webSocket.send(game.getJSON());
            }
        }
    });
});

function handleConnection(webSocket){
    // create new client object containing client's webSocket, ID, and role
    let client = objectifySocket(webSocket);
    console.log("A client has connected. Client ID is: " + client.id);

    // need to designate client as player 1, 2, or spectator
    if(clients.length == 0){
        client.role = 1;
    }
    else if(clients.length == 1){
        client.role = 2;
    }
    else{
        client.role = -1;
    }

    // need to save client object to list of clients
    clients.push(client);

    // assign client a role
    webSocket.send(JSON.stringify({
        memo: "describe_role",
        data: {
            role: client.role
        }
    }));

    // send JSON of game to client
    webSocket.send(game.getJSON());
    webSocket.on('message', (event) =>{
        console.log(event.toString());
    });

    return client;
}

function objectifySocket(webSocket){
    return {
        webSocket,
        id: nextId++,
        role: undefined
    }
}