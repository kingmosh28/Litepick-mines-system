const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

// Track active connections
const connections = new Set();

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
    connections.add(ws);

    ws.on('message', async (msg) => {
        console.log('⚡ Message Received:', msg);

        try {
            // Parse incoming data
            const data = JSON.parse(msg);
            const { cookies, csrf_test_name } = data;

            // Send initial confirmation
            ws.send(JSON.stringify({
                status: 'received',
                message: 'Data received, processing bet...'
            }));

            // Initialize Ember model and place bet
            const minesModel = global.emberApp.lookup('service:mines');
            const betResponse = await minesModel.placeBet(cookies, csrf_test_name);

            // Send mines data back to client
            ws.send(JSON.stringify({
                status: 'success',
                mines: betResponse.mines,
                balance: betResponse.balance
            }));

        } catch (error) {
            ws.send(JSON.stringify({
                status: 'error',
                message: 'Error processing bet'
            }));
            console.error('💥 Error:', error);
        }
    });

    // Keep connection alive
    const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
        }
    }, 30000);

    ws.on('close', () => {
        console.log('⚡ Lightning Pipeline Closed');
        connections.delete(ws);
        clearInterval(pingInterval);
    });

    ws.on('error', (error) => {
        console.error('💥 WebSocket Error:', error);
        connections.delete(ws);
        clearInterval(pingInterval);
    });
});

// Broadcast to all connections
function broadcast(data) {
    connections.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

server.listen(3000, () => {
    console.log('⚡ Lightning Server Running on Port 3000');
});
