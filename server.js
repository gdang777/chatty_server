
const express = require('express');
const SocketServer = require('ws').Server;
const uuidv4 = require('uuid/v4');


const PORT = 3001;

//-------- new express server
const server = express()
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({server});

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
  ws.on('close', () => {
    console.log('Client disconnected');
  let users = {
        id: uuidv4(),
        type: 'connectedUsers',
        count: wss.clients.size
      }
  wss.clients.forEach(client => {
      client.send(JSON.stringify(users));
    });
  });
});