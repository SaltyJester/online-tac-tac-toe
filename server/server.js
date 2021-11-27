const {WebSocketServer} = require('ws');
const {TicTacToe} = require('./util/tic-tac-toe');

// let game = new TicTacToe();
// let result = game.makeMove(-1,0,2);

let nextId = 0;
let port = 8080;
const wss = new WebSocketServer({ port }, ()=>{
    console.log("Starting WebSocketServer on port " + port);
});

wss.on('connection', (webSocket) => {
    console.log('A client has connected!');
    webSocket.on('message', (event) =>{
        console.log(event.toString());
    });
});


// wss.on('connection', handleConnection);

// function handleConnection(ws){
//     let client = createSocketObj(ws);

//     if(clients.length == 0){
//         client.role = Math.floor(Math.random() * 2) + 1;
//     }
//     else if(clients.length == 1){
//         client.role = 3 - clients[0].role;
//     }
//     else{
//         client.role = -1;
//     }

//     clients.push(client);
//     ws.on('message', (message) => handleMessage(client, message));
//     ws.send(JSON.stringify({
//         memo: "describe_role",
//         data: client.role
//     }));

//     if(clients.length == 2){
//         notifyUsersOfState();
//     }
// }

// function handleMessage(client, message){
//     if(obj.memo === "chat_message"){
//         broadcastChatMessage(client.id, obj.data.text);
//     }
// }

// function createSocketObj(ws)
// {
//     return {
//         ws: ws, 
//         id: nextId++
//     };
// }