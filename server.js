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
            const members = rooms.get(ws.roomId);
            if (members) {
                members.forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(message, { binary: isBinary });
                    }
                });
            }
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
        const { pathname } = parse(req.url || "/", true);

        // Make sure we all for hot module reloading
        if (pathname === "/_next/webpack-hmr") {
            nextApp.getUpgradeHandler()(req, socket, head);
        }

        // Set the path we want to upgrade to WebSockets
        if (pathname === "/api/ws") {
            wss.handleUpgrade(req, socket, head, (ws) => {
                wss.emit('connection', ws, req);
            });
        }
    });
})
