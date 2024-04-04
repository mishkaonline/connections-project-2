const express = require('express');
const { createServer } = require('http');
// const { join } = require('node:path');
const { Server } = require('socket.io');
require('dotenv').config();

//Initialise HTTP Server
const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("Server listening at port: " + port)
});

//Initialise Socket.io
const io = new Server(server);

app.use('/', express.static('public')); // Serve index.html via Express

// Serve About, Submit and Leaderboard Pages via Express
app.use('/about', express.static('public/about.html'));
app.use('/submit', express.static('public/submit.html'));
app.use('/leaderboard', express.static('public/leaderboard.html'));

// Body Parser to Parse JSON Data
app.use(express.json());

const users = {} // object to store names and scores

// Connect to MongoDB via QuickMongo
const { Database } = require('quickmongo');


// New Key using environment variable
const db = new Database(process.env.mongodburl);

db.on("ready", () => {
  console.log("db ready!");
}
);

db.connect();
console.log("db connected!");

// add route to get all questions from database
app.get('/getQuestions', async (req, res) => {
  try {
    // Fetch from the DB using await
    const questions = await db.get("questions");
    console.log(questions);
    if (!questions) {
      return res.status(404).json({ error: "No questions found" });
    }
    let obj = { questions };
    res.json(obj);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// add route to get all leaderboard data from database
app.get('/getLeaderboard', async (req, res) => {
  try {
    // Fetch from the DB using await
    const leaderboard = await db.get("leaderboard");
    console.log(leaderboard);
    if (!leaderboard) {
      return res.status(404).json({ error: "No leaderboard data found" });
    }
    let obj = { leaderboard };
    res.json(obj);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Connecting and Disconnecting Sockets

io.on('connection', (socket) => { // when a new user connects
  console.log("we have a new player: " + socket.id);

  io.emit('user scores', users); // send an object with key "user scores" and value [all online players] to everyone
  const userID = socket.id; // store the user's socket id in a constant
  users[userID] = {}; // create an empty object for the user in the users object

  socket.on('new user', (name) => {
    console.log('Our new player is called: ' + name);
    users[userID].name = name; // add the name to the user's object

  });
  // listen for user scores and update the users object
  socket.on('user scores', (score) => {
    console.log('User scores: ' + score);
    users[userID].score = score; // add the score to the user's object

    console.log(users);
    io.emit('user scores', users); // Why do we do it both here and above?
  });

  // Listen for time taken and add it to the users object
  socket.on('time taken', (time) => {
    console.log('Time taken: ' + time);
    users[userID].time = time; // add the time to the user's object

    // add today's date to the user object
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    users[userID].date = date;

    console.log(users);
    // io.emit('user scores', users);

    // Add the user name, score and time to leaderboard database
    db.push("leaderboard", users[userID]);

  });

  socket.on('disconnect', () => {
    delete users[userID]; // remove a player from the users object when they disconnect
    console.log(users);
  });
});

// SUBMITTING FUN FACTS - WORKS!

// Listen for a Post Request to /submit
app.post('/funFact', (req, res) => {
  console.log("submitting a fun fact");

  console.log(req.body); // req.body is the data sent from the client, an object with keys "question" and "answer"

  // Add a fun fact to the database
  db.push("questions", req.body);

  res.json({ task: "success" });

});