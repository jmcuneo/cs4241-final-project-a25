const { parse } = require('url');
const express = require("express");
const next = require('next');
const http = require('http');
const WebSocket = require('ws');

const dev = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || 3000;
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

// Create HTTP server
const app = express();
const server = http.createServer(app);

// WebSocket server attached to the same HTTP server
const wss = new WebSocket.Server({ noServer: true });
const rooms = new Map();
const waitingClients = [];

// Handle WebSocket upgrade
server.on("upgrade", (req, socket, head) => {
    const { pathname } = parse(req.url || "/", true);
    console.log("Upgrade request pathname:", pathname);

    // Handle WebSocket upgrade - using /ws to avoid NextAuth conflict
    if (pathname === "/ws") {
        console.log("Upgrading to WebSocket");
        wss.handleUpgrade(req, socket, head, (ws) => {
            console.log("WebSocket upgrade successful");
            wss.emit('connection', ws, req);
        });
        return;
    }

    // Allow Next.js HMR in development
    if (dev && pathname === "/_next/webpack-hmr") {
        nextApp.getUpgradeHandler()(req, socket, head);
        return;
    }

    // Destroy any other upgrade requests
    socket.destroy();
});

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

    ws.on('message', (data, isBinary) => {
        const message = isBinary ? data : data.toString();
        console.log("Message received:", message);

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
    // Handle all HTTP requests with Next.js
    app.use((req, res) => {
        return handle(req, res);
    });

    server.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${PORT}`);
    });
});