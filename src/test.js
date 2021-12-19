import express from 'express';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import * as path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const wss = new WebSocketServer({noServer: true});

wss.on('connection', socket => {
  socket.on('message', message => console.log(JSON.parse(message)));
});

const server = app.listen(3000);
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

console.log(__dirname);