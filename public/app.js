let socket = io(); // create a socket connection
let isAnswered = false; // boolean to check if player has answered the question
let introVisible = true; // boolean to check if intro is visible
let currentQuestion = 0; // current question number
let currentScore = 0; // current score for player
const maxQuestions = 5; // maximum number of questions to ask per game
let shuffledQuestions; // array to store shuffled questions
let uniqueAnswers; // array to store unique answers

window.addEventListener('load', () => {
    // Get all questions from server
    fetch('/getQuestions', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // Shuffle the questions
            shuffledQuestions = shuffle(data.questions);

            // Grab the names from the questions and put them in an array
            let answerPool = [];
            for (let i = 0; i < shuffledQuestions.length; i++) {
                answerPool.push(shuffledQuestions[i].answer);
            }

            // Check answerPool for duplicates and remove them
            uniqueAnswers = [...new Set(answerPool)];

            console.log(uniqueAnswers);
            // console.log(shuffledQuestions);
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
        });

    // Starting the Game
    const submitButton = document.getElementById("submit-button");
    submitButton.addEventListener("click", () => {

        //get the user's name from input box
        const playerName = document.getElementById('name-field').value; // set playerName to what was just typed in the field
        socket.emit('new user', playerName);

        // Display the user name and current score (zero) 
        socket.emit('user scores', currentScore);

        // Start the Quiz
        console.log("starting the quiz");

        // Get First Question
        getQuestion();
    })

    // Get a Question when Requested
    function getQuestion() {

        // reset isAnswered to false
        isAnswered = false;

        // remove the intro if it's still visible
        removeIntro();

        // log the current question number
        console.log("question: " + (currentQuestion + 1) + " of " + maxQuestions);

        // Pick the first question from our shuffled questions array
        let question = shuffledQuestions[0].question;

        // check the answer of the question
        let answer = shuffledQuestions[0].answer;

        // create an array to store the options
        let options = [];

        // add the correct answer to the options array
        options.push(answer);

        // pick 4 other answers from the uniqueAnswers array, excluding the correct answer and not repeating any
        while (options.length < 5) {
            let randomAnswer = uniqueAnswers[Math.floor(Math.random() * uniqueAnswers.length)];
            if (!options.includes(randomAnswer)) {
                options.push(randomAnswer);
            }
        }

        // shuffle the options array
        options = shuffle(options);

        console.log(question);
        console.log(options);

        //create new div for question and add a paragraph with the question text
        let quizDiv = document.getElementById('quiz');
        let questionText = document.createElement('p');
        questionText.id = "question";
        questionText.className = 'question';
        questionText.innerHTML = question;
        quizDiv.appendChild(questionText);

        //create new div for options
        let optionsDiv = document.createElement('div');
        optionsDiv.id = "options";
        optionsDiv.className = "options";
        quizDiv.appendChild(optionsDiv);

        // create a button for each option
        for (let i = 0; i < options.length; i++) {
            let option = document.createElement('div');
            option.id = "option" + i;
            option.className = "option";

            // create an image element for the avatar
            let avatarImg = document.createElement('img');
            avatarImg.src = "./avatars/" + options[i] + ".svg";
            avatarImg.alt = "Avatar";

            // if the image fails to load, use the default avatar
            avatarImg.onerror = function () {
                this.src = "./avatars/default.svg"; // Set the default image path
            };

            // append the image element to the option div
            option.appendChild(avatarImg);

            // add option text below the avatar
            let optionText = document.createElement('p');
            optionText.innerHTML = options[i];
            option.appendChild(optionText);

            optionsDiv.appendChild(option);

            // when player selects answer
            let optionButton = document.getElementById("option" + i);
            optionButton.onclick = function () {
                if (!isAnswered) {
                    optionButton.classList.add("selected");
                    console.log("Player answered: " + i);
                    isAnswered = true;
                }

                // Check if the selected option is the correct answer
                let quizDiv = document.getElementById('quiz');
                let results = document.createElement('p');
                results.id = "results";
                quizDiv.appendChild(results);

                if (options[i] == answer) {
                    console.log("correct!");

                    optionButton.classList.add("correct"); // change the button to the success state

                    results.innerHTML = "Correct!"; // display correct message

                    currentScore++; // add 1 to the score
                    console.log("current score: " + currentScore);

                    // set the user's score in the users object NOT WORKING
                    // users[userID].score = currentScore;

                    // emit the updated score to the server NOT WORKING
                    socket.emit('user scores', currentScore);
                }

                // If the selected option is incorrect
                else {
                    console.log("incorrect!");

                    optionButton.classList.add("incorrect"); // change the button to the failure state

                    results.innerHTML = "Wrong!"; // display wrong message
                }

                // add a button to request the next question
                let nextButton = document.createElement('button');
                if (currentQuestion < maxQuestions - 1) {
                    nextButton.innerHTML = "Next Question";
                } else {
                    nextButton.innerHTML = "See Results";
                }
                nextButton.id = "next-button";
                nextButton.className = "button";
                quizDiv.appendChild(nextButton);


                // When the player clicks the next question button
                nextButton.addEventListener("click", () => {

                    // add 1 to the current question number
                    currentQuestion++;

                    // remove the question and options from the page
                    removeQuestion();

                    // Splice the question from the array so it can't be asked again
                    shuffledQuestions.splice(0, 1);

                    console.log("requesting next question");
                    questionLoop();

                })

            }

        };

        // end getQuestion function

    }

    function questionLoop() {
        // if under max questions, get a question, else, end the game
        if (currentQuestion < maxQuestions) {
            getQuestion();

        } else {
            console.log("game over!");
            endGame();
        }
    }

    // When Max Questions is reached, display the final score
    function endGame() {
        removeQuestion();

        // create a div for the results
        let quizDiv = document.getElementById('quiz');

        let gameOver = document.createElement('h1');
        let results = document.createElement('p');
        let score = document.createElement('p');
        let outOf = document.createElement('p');
        let message = document.createElement('p');

        gameOver.id = "game-over";
        results.id = "results";
        score.id = "score";
        outOf.id = "out-of";
        message.id = "message";

        quizDiv.appendChild(gameOver);
        quizDiv.appendChild(results);
        quizDiv.appendChild(score);
        quizDiv.appendChild(outOf);
        quizDiv.appendChild(message);

        gameOver.innerHTML = "Game Over!";
        results.innerHTML = "You got";
        score.innerHTML = currentScore;
        outOf.innerHTML = "out of " + maxQuestions + " questions.";

        // display a different message based on what score the player got
        if (currentScore == 0) {
            message.innerHTML = "You don't know us at all. Do you even go here?";
        } else if (currentScore == 1) {
            message.innerHTML = "Stop doing homework and start hanging out with us, kthxbye.";
        } else if (currentScore == 2) {
            message.innerHTML = "You've clearly been paying attention, but you can do better!";
        } else if (currentScore == 3) {
            message.innerHTML = "Wow, you know us pretty well! But not quite well enough...";
        }
        else if (currentScore == 4) {
            message.innerHTML = "Whoa, you know your stuff. You're clearly the cohort confidant!";
        }
        else if (currentScore == 5) {
            message.innerHTML = "Umm, stalker much? You're the cohort creep!";
        }

        // create a div for the buttons
        let buttonGroup = document.createElement('div');
        buttonGroup.id = "button-group";
        buttonGroup.className = "button-group";
        quizDiv.appendChild(buttonGroup);

        // add a button to play again
        let playAgainButton = document.createElement('button');
        playAgainButton.innerHTML = "Play Again";
        playAgainButton.id = "play-again";
        // playAgainButton.className = "button";
        buttonGroup.appendChild(playAgainButton);

        // When the player clicks the play again button, reset the game
        playAgainButton.addEventListener("click", () => {
            console.log("resetting the game");
            currentQuestion = 0;
            currentScore = 0;

            clearGameover();
            getQuestion();
        })

        // add a button to submit a fun fact
        let funFactButton = document.createElement('button');
        funFactButton.innerHTML = "Submit a Fun Fact";
        funFactButton.id = "fun-fact";
        funFactButton.className = "button-secondary";
        buttonGroup.appendChild(funFactButton);

        // link submit button to /submit page
        funFactButton.addEventListener("click", () => {
            window.location.href = "/submit";
        })


        // add a button to view the leaderboard
        let leaderboardButton = document.createElement('button');
        leaderboardButton.innerHTML = "View Leaderboard";
        leaderboardButton.id = "leaderboard";
        leaderboardButton.className = "button-secondary";
        buttonGroup.appendChild(leaderboardButton);

        // When the player clicks the leaderboard button, display the leaderboard
        leaderboardButton.addEventListener("click", () => {
            console.log("viewing leaderboard");
            clearGameover();
            getLeaderboard();
        });

    }

    // Function to update the scoreboard UI
    function updateScoreboard(users) {
        const scoreboard = document.getElementById('scoreboard');
        scoreboard.innerHTML = '';

        Object.keys(users).forEach((userID) => {
            const user = users[userID];
            if (!user.name) {
                return;
            }
            const scoreElement = document.createElement('div');
            scoreElement.className = 'score';
            scoreElement.textContent = `${user.name}: ${user.score || 0}`;
            scoreboard.appendChild(scoreElement);
        });
    }

    // Function to shuffle an array
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {

            // Pick a random index from 0 to i
            const j = Math.floor(Math.random() * (i + 1));

            // Swap array[i] with array[j]
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    }

    // Function to remove intro when quiz starts
    function removeIntro() {
        if (introVisible) {
            let intro = document.getElementById('intro');
            intro.remove();
            introVisible = false;
        }
    }

    // Function to remove question when next question loaded
    function removeQuestion() {
        let question = document.getElementById('question');
        if (question) {
            question.remove();
        }
        let options = document.getElementById('options');
        if (options) {
            options.remove();
        }
        let results = document.getElementById('results');
        if (results) {
            results.remove();
        }
        let nextButton = document.getElementById('next-button');
        if (nextButton) {
            nextButton.remove();
        }
    }


    // create/update the scoreboard when user data received
    socket.on('user scores', (users) => {
        updateScoreboard(users);
    });


    // Log anything we receive with the key "user scores"
    socket.on('user scores', (data) => {
        console.log(data);
    })

    // Function to clear the game over screen
    function clearGameover() {

        let gameOver = document.getElementById('game-over');
        if (gameOver) {
            gameOver.remove();
        }
        let results = document.getElementById('results');
        if (results) {
            results.remove();
        }
        let message = document.getElementById('message');
        if (message) {
            message.remove();
        }
        let score = document.getElementById('score');
        if (score) {
            score.remove();
        }
        let outOf = document.getElementById('out-of');
        if (outOf) {
            outOf.remove();
        }
        let buttonGroup = document.getElementById('button-group');
        if (buttonGroup) {
            buttonGroup.remove();
        }

        // let playAgainButton = document.getElementById('play-again');
        // if (playAgainButton) {
        //     playAgainButton.remove();
        // }
        // let funFactButton = document.getElementById('fun-fact');
        // if (funFactButton) {
        //     funFactButton.remove();
        // }
        // let leaderboardButton = document.getElementById('leaderboard');
        // if (leaderboardButton) {
        //     leaderboardButton.remove();
        // }
    }


})