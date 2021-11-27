// import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8080');

ws.onmessage = (event) => {
    console.log("Receiving message from the server!");
}

function sendMessage(msg){
    ws.send(msg);
}