
const express = require('express');
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4');


// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');
  let users = {
        id: uuidv4(),
        type: 'connectedUsers',
        count: wss.clients.size
      }
  console.log("connections", users);

  wss.clients.forEach(client => {
          client.send(JSON.stringify(users));
      });


  ws.on('message', (incomingMessageOnServer) => {
    const parsedMessage = JSON.parse(incomingMessageOnServer);
    console.log("server", parsedMessage);

    switch(parsedMessage.type) {
    case 'postMessage':
      let newObj = {
            id: uuidv4(),
            type: 'incomingMessage',
            username: parsedMessage.username,
            content:  parsedMessage.content
          }
      wss.clients.forEach(client => {
          client.send(JSON.stringify(newObj));
      });
      break;
    case 'postNotification':
      let newObj1 = {
              id: uuidv4(),
              type: 'incomingNotification',
              content:  parsedMessage.content
          }
      wss.clients.forEach(client => {
          client.send(JSON.stringify(newObj1));
      });
      break;
    }
  })

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
   let users = {
        id: uuidv4(),
        type: 'connectedUsers',
        count: wss.clients.size
      }
  console.log("connections", users);

  wss.clients.forEach(client => {
          client.send(JSON.stringify(users));
      });
  });
});