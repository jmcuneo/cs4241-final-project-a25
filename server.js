const express = require("express");
const next = require('next');
const http = require('http');
const WebSocket = require('ws');

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

// WebSocket server on separate port
const wsServer = http.createServer();
const wss = new WebSocket.Server({ server: wsServer });
const rooms = new Map();
const waitingClients = [];

wss.on('connection', (ws) => {
    console.log("New client connected");

    waitingClients.push(ws);

    if (waitingClients.length >= 2) {
        // Create a new room
        const roomId = `room-${rooms.size + 1}`;
        const [player1, player2] = waitingClients.splice(0, 2);
        const room = new Set([player1, player2]);
        rooms.set(roomId, room);

        player1.roomId = roomId;
        player2.roomId = roomId;

        // Notify players
        [player1, player2].forEach((client, i) => {
            client.send(JSON.stringify({
                event: "joined",
                data: { roomId, player: i + 1 }
            }));
        });

        console.log(`Room ${roomId} started with 2 players`);
    }

    ws.on('message', (message) => {
        console.log("Message received:", message.toString());

        const members = rooms.get(ws.roomId);
        if (members) {
            members.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        }
    });

    ws.on('close', () => {
        if (ws.roomId) {
            const members = rooms.get(ws.roomId);
            if (members) {
                members.delete(ws);

                // Notify other player that opponent disconnected
                members.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            event: "opponentDisconnected"
                        }));
                    }
                });

                if (members.size === 0) {
                    rooms.delete(ws.roomId);
                    console.log(`Deleted ${ws.roomId}`);
                }
            }
        }

        // Remove from waiting queue if still waiting
        const index = waitingClients.indexOf(ws);
        if (index !== -1) waitingClients.splice(index, 1);

        console.log("Client disconnected");
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

nextApp.prepare().then(() => {
    const app = express();

    app.use((req, res) => {
        return handle(req, res);
    });

    app.listen(3000, () => {
        console.log('> Next.js on http://localhost:3000');
    });

    wsServer.listen(3001, () => {
        console.log('> WebSocket server on ws://localhost:3001');
    });
});