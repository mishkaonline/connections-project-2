let express = require('express');
let app = express();
app.use('/', express.static('public'));

//trivia questions
let quiz = [{
    question : "what is 3+7",
    options : ["10", "20", "23","37"],
    answer : 0
}, {
    question : "Which of these is the largest mammal",
    options : ["dog", "cat", "elephant","whale"],
    answer : 3
}, {
    question : "How many planets are there in the solar system?",
    options : ["8", "9", "10","I'm not ever sure anymore"],
    answer : 1
}];

//store the data about answers
let answer = {
    total : 0,
    right : 0,
    wrong : 0
}

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

//Initialize socket.io
let io = require('socket.io');
io = new io.Server(server);

let output = io.of('/output');
let input = io.of('/input');
let quizNo = 0;

output.on('connection', (socket) => {
    console.log('output socket connected !!!!!!! : ' + socket.id);

    socket.on('getquestion',()=> {
        answer.total = 0;
        answer.right = 0;
        answer.wrong = 0;
        console.log('output client has requested for a question');
        quizNo = Math.floor(Math.random()*quiz.length);
        //send the question + answer to the output client
        let outputdata = {
            question : quiz[quizNo].question,
            answer : quiz[quizNo].answer
        };
        output.emit('question', outputdata);
        //send the question + options  to the input client
        let inputdata = {
            question : quiz[quizNo].question,
            options : quiz[quizNo].options
        };
        input.emit('question', inputdata);
    })

    socket.on('getanswer', () => {
        output.emit('answers', answer);
    })
})

input.on('connection', (socket) => {
    console.log('input socket connected : ' + socket.id);

    //on receiving answer from the client
    socket.on('answer', (data) => {
        answer.total++;
        if(data.answer == quiz[quizNo].answer) {
            answer.right++;
            socket.emit('answer', {answer: true})
        } else {
            answer.wrong++;
            socket.emit('answer', {answer: false})
        }
    })

})

// STEPS TO MAKE COHORT TRIVIA GAME

// 1. Each Player enters their name

// 2. (Optional) Each Player is assigned a random color

// 3. There might be a need to initialise a "room" by having each player press start

// 4. A random question is displayed to all players

// 5. 5 answers are shuffled and displayed to all players, including the correct answer

// 6. Countdown timer starts

// 7. Each player selects an answer

// 8. Once all players have selected or the timer is up, the correct answer is displayed to all players

// 9. Each player can see what the other players answered (emit)

// 10. Each player is awarded points for correct answers

// 11. Scoreboard is updated

// 12. Repeat from step 4 until five questions have been answered

// 13. Show a results screen including each player's score

// 14. The player with the most points wins

// REQUIREMENTS

// 1. Database of questions and answers (optional: wrong answers for each question) - MongoDB

// 2. Ability for new client to join the game and pick a name - Socket.io

// 3. Assign score to client - Socket.io/MongoDB?