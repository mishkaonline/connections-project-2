const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

// app.get('/', (req, res) => {
//   res.sendFile(join(__dirname, 'index.html'));
// });

app.use('/', express.static('public'));

const users = {}

io.on('connection', (socket) => {
    io.emit('user scores', users);
    const userID = socket.id;
    users[userID] = {};

    socket.on('new user', (name) => {
      console.log('message: ' + name);
      users[userID].name = name;
      console.log(users);
      io.emit('user scores', users);
    });
    socket.on('disconnect', function () {
        delete users[userID];
        console.log(users);
    });
  });

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});