const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
let quiz = require('./data/quiz.json'); // import questions from quiz.json


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
  socket.on('disconnect', () => {
    delete users[userID]; // remove a player from the users object when they disconnect
    console.log(users);
  });

  // When client requests a question, send a random question
  socket.on('getquestion', () => {
    console.log("question requested");

    // send a random question to the user
    questionNo = Math.floor(Math.random() * quiz.questions.length);
    console.log(questionNo);

    // send the question and options to client
    io.emit('question', quiz.questions[questionNo].question, quiz.questions[questionNo].options);

    // log what we sent
    console.log(quiz.questions[questionNo].question);
    console.log(quiz.questions[questionNo].options);

  });

});



// async function getQuestions() {
//   return fetch('data/quiz.json').then(res => res.json())
//     .then(data => {
//       console.log(data);
//       return data;
//     })
//     .catch((error) => {
//       console.error('Error:', error);
//     });
// }
