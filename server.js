// server.js
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
const clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('New client connected. Total clients:', clients.size);

    ws.on('message', (message, isBinary) => {
        const messageStr = message.toString();
        console.log(`Message received: ${messageStr}`);

        if (messageStr === '{"event":"ping"}') {
            return;
        }

        clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message, { binary: isBinary });
            }
        });
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected. Total clients:', clients.size);
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

const { parse } = require('url');
const express = require("express");
const next = require('next');
const WebSocket = require('ws');
const { WebSocketServer } = require('ws');

const app = express();
const server = app.listen(3000);
const wss = new WebSocketServer({ noServer: true });
const nextApp = next({ dev: process.env.NODE_ENV !== "production" });
const rooms = new Map();
const clients = new Set();
const waitingClients = [];

nextApp.prepare().then(() => {
    app.use((req, res, next) => {
        nextApp.getRequestHandler()(req, res, parse(req.url, true));
    });

    wss.on('connection', (ws) => {
        console.log("Client connection");
        let roomId = null;

        waitingClients.push(ws);

        if (waitingClients.length >= 2) {
            // create a new room
            const roomId = `room-${rooms.size + 1}`;
            const [player1, player2] = waitingClients.splice(0, 2);
            const room = new Set([player1, player2]);
            rooms.set(roomId, room);

            player1.roomId = roomId;
            player2.roomId = roomId;

            // notify players
            [player1, player2].forEach((client, i) => {
                client.send(JSON.stringify({ event: "joined", data: { roomId, player: i + 1 } }));
            });

            console.log(`Room ${roomId} started with 2 players`);
        }

        ws.on('message', (message, isBinary) => {
            console.log("WS connected");
            ws.on("message", (msg) => {
                console.log("Message:", msg.toString());
                ws.send("pong");
            });
            // const members = rooms.get(ws.roomId);
            // if (members) {
            //     members.forEach(client => {
            //         if (client !== ws && client.readyState === WebSocket.OPEN) {
            //             client.send(message, { binary: isBinary });
            //         }
            //     });
            // }
        });

        ws.on('close', () => {
            if (ws.roomId) {
                const members = rooms.get(ws.roomId);
                if (members) {
                    members.delete(ws);
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
    });

    server.on("upgrade", (req, socket, head) => {
        console.log("Upgrading")
        const { pathname } = parse(req.url || "/", true);
        console.log("Upgrade request pathname:", pathname);
        // Make sure we all for hot module reloading
        if (pathname === "/_next/webpack-hmr") {
            nextApp.getUpgradeHandler()(req, socket, head);
            return;
        }

        // Set the path we want to upgrade to WebSockets
        else if (pathname === "/api/ws") {
            console.log("Upgrade path")
            wss.handleUpgrade(req, socket, head, (ws) => {
                console.log("Attempting connection")
                wss.emit('connection', ws, req);
                console.log("Connection worked", ws);
            });
            return;
        }
        socket.destroy();

        console.log("Completed upgrade")
    });
})
