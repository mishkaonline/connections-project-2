const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
let quiz = require('./data/quiz.json'); // import questions from quiz.json

//Variables
let questionNo = 0; // used to select a question from the array

const maxQuestions = 5; // maximum number of questions to ask per game
let currentQuestion = 0; // current question number
let currentScore = 0; // current score for player


//Initialise HTTP Server
const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Server listening at port: " + port)
});

//Initialise Socket.io
const io = new Server(server);



// app.get('/', (req, res) => {
//   res.sendFile(join(__dirname, 'index.html'));
// });

app.use('/', express.static('public'));

const users = {} // object to store names and scores

io.on('connection', (socket) => { // when a new user connects
  console.log("we have a new player: " + socket.id);

  io.emit('user scores', users); // send an object with key "user scores" and value [all online players] to everyone
  const userID = socket.id; // store the user's socket id in a constant
  users[userID] = {}; // create an empty object for the user in the users object

  socket.on('new user', (name) => {
    console.log('Our new player is called: ' + name);
    users[userID].name = name; // add the name to the user's object

    // add score to user object?

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

  // Update the scoreboard when user data received?


});

io.on('connection', (socket) => {
  console.log('input socket connected : ' + socket.id);

  // When client submits an answer, check if it's correct
  socket.on('answer', (answer) => {
    console.log("answer submitted: " + answer);
    console.log("correct answer: " + quiz.questions[questionNo].answer);

    // get the NAME of the correct answer
    let correctAnswer = quiz.questions[questionNo].options[quiz.questions[questionNo].answer];

    if (answer == quiz.questions[questionNo].answer) {
      console.log("correct!");
      currentScore++;
      console.log("current score: " + currentScore);
      socket.emit("results", { answer: true, name: correctAnswer });
    } else {
      console.log("incorrect!");
      socket.emit('results', { answer: false, name: correctAnswer });
    }


    // remove the question from the array so it can't be asked again
    quiz.questions.splice(questionNo, 1);

    // check if we've reached the maximum number of questions
    if (currentQuestion < maxQuestions) {
      currentQuestion++;
      console.log(currentQuestion + " out of " + maxQuestions + " questions asked");
    } else {
      console.log(currentQuestion + " out of " + maxQuestions + " questions asked");
      console.log("game over!");
      io.emit('gameOver', { score: currentScore, max: maxQuestions });
    }
    io.emit('user scores', users);

  })
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
