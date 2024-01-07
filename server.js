// app.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import http from 'http';  // Import http module for Express.js server
import { server as WebSocketServer } from 'websocket';
import dotenv from 'dotenv';
import user_route from './router/user_route.js';
import groupRouter from './router/group_route.js';
import post_router from './router/post_route.js';
import { getCurrentTime } from './controllers/chatController.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.disable('x-powered-by');
app.use(morgan('tiny'));

app.use('/api/v1/user', user_route);
app.use('/api/v1', groupRouter);
app.use('/api/v1/post', post_router);

app.get('/', (req, res) => {
    res.status(201).json('home get');
});

mongoose
    .connect(process.env.MONGO_URL, {})
    .then(() => {
        console.log('DataBase Connected successfully');
    })
    .catch((error) => {
        console.log(error);
    });

// Combine WebSocket and HTTP server
const httpServer = http.createServer(app);

const wsServer = new WebSocketServer({
    httpServer: httpServer,
    autoAcceptConnections: false,
});

const endpointToConnectedUsersMap = new Map();

wsServer.on('request', (request) => {
    try {
        const connection = request.accept(null, request.origin);
        console.log(`${new Date()} Connection accepted.`);

        const username = request.resourceURL.query.username;
        const endpoint = request.resourceURL.pathname.slice(1);

        if (!endpointToConnectedUsersMap.has(endpoint)) {
            endpointToConnectedUsersMap.set(endpoint, new Map());
        }

        const connectedUsers = endpointToConnectedUsersMap.get(endpoint);

        connectedUsers.forEach((client) => {
            if (client.socket !== connection && client.socket.connected) {
                connection.sendUTF(client.messageHistory);
            }
        });

        connectedUsers.set(connection, { username, socket: connection, messageHistory: [] });

        connection.on('message', (message) => {
            if (message.type === 'utf8') {
                const receivedMessage = message.utf8Data;
                const timestamp = getCurrentTime();
                const formattedMessage = JSON.stringify({ username, timestamp, content: receivedMessage });

                connectedUsers.forEach((client) => {
                    if (client.socket && client.socket !== connection && client.socket.connected) {
                        client.socket.sendUTF(formattedMessage);
                    }
                });

                connectedUsers.get(connection).messageHistory.push(formattedMessage);
            }
        });

        connection.on('close', () => {
            console.log(`${new Date()} Peer ${connection.remoteAddress} disconnected.`);
            connectedUsers.delete(connection);
        });
    } catch (error) {
        console.error('Error accepting WebSocket connection:', error);
    }
});

const PORT = process.env.PORT || 8000;

httpServer.listen(PORT, () => {
    console.log(`${new Date()} Server is listening on port ${PORT}`);
});
