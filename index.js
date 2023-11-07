const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

//Initialise HTTP Server
const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Server listening at port: " + port)
});

//Initialise Socket.io
const io = new Server(server);

//Variables
let questionNo = 0;
let currentScore = 0;

// app.get('/', (req, res) => {
//   res.sendFile(join(__dirname, 'index.html'));
// });

app.use('/', express.static('public'));

const users = {} // object to store names and scores

io.on('connection', (socket) => { // when a new user connects
  console.log("we have a new player: " + socket.id);

  io.emit('user scores', users); // send an object  with key "user scores" and value [all online players] to everyone
  const userID = socket.id; // store the user's socket id in a constant
  users[userID] = {}; // create an empty object for the user in the users object

  socket.on('new user', (name) => {
    console.log('Our new player is called: ' + name);
    users[userID].name = name; // add the name to the user's object
    console.log(users);
    io.emit('user scores', users); // Why do we do it both here and above?
  });
  socket.on('disconnect', function () {
    delete users[userID]; // remove a player from the users object when they disconnect
    console.log(users);
  });

  socket.on('getquestion', () => {
    console.log("question requested");
    getQuestions().then(data => {
      console.log(data);
      io.emit('question', data[questionNo].question, data[questionNo].options);
    });

    // fetch questions from data/quiz.json
    // async function getQuestions() {
    //   const response = await fetch('data/quiz.json');
    //   const data = await response.json();
    //   return data;
    //   console.log(data);
    // }

    // send a random question to the user
    questionNo = Math.floor(Math.random() * questions.length);

    // send the question and options to client
    io.emit('question', questions[questionNo].question, questions[questionNo].options);

  });
});

async function getQuestions() {
  return fetch('data/quiz.json').then(res => res.json())
    .then(data => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
