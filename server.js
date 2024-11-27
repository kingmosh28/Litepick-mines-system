const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', (request, socket, head) => {
    const pathname = request.url;
    if (pathname === '/lightning-pipeline') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

wss.on('connection', (ws) => {
    console.log('⚡ Lightning Pipeline Connected');

    ws.on('message', (msg) => {
        console.log('⚡ Message Received:', msg);

        // Parse incoming data
        const data = JSON.parse(msg);
        const cookies = data.cookies;
        const localStorageData = data.localStorageData;
        const betData = data.betData;

        // Send confirmation
        ws.send('Data received');
        
        // Pass data to Ember model
        global.emberApp.lookup('controller:application').set('gameData', {
            cookies,
            localStorageData,
            betData
        });
    });

    ws.on('close', () => {
        console.log('⚡ Lightning Pipeline Closed');
    });
});

server.listen(3000, () => {
    console.log('⚡ Lightning Server Running on Port 3000');
});
