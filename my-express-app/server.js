const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Array to store connected clients
const clients = [];

// WebSocket event handlers
wss.on('connection', (ws) => {
  // Add new client to the list
  clients.push(ws);

  // Send a welcome message to the new client
  //ws.send(JSON.stringify({ sender: 'Server', message: 'Welcome to the chat!' }));

  // Broadcast a message when a new client connects
  //broadcast({ sender: 'Server', message: `New client connected (total: ${clients.length})` }, ws);

  // Handle incoming messages
  ws.on('message', (messageData) => {
    const message = JSON.parse(messageData);
    broadcast(message, ws);
  });

  // Handle client disconnection
  ws.on('close', () => {
    // Remove the disconnected client from the list
    clients.splice(clients.indexOf(ws), 1);

    // Broadcast a message when a client disconnects
    //broadcast({ sender: 'Server', message: `Client disconnected (total: ${clients.length})` }, ws);
  });
});

// Helper function to broadcast a message to all connected clients
function broadcast(message, senderWs) {
  clients.forEach((client) => {
    if (client !== senderWs) {
      client.send(JSON.stringify(message));
    }
  });
}

// Serve static files from the "public" directory
app.use(express.static('public'));

// Start the server
const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});