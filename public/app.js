let socket = io();
let isAnswered = false; // boolean to check if player has answered the question
//socket.emit('new user', "test");


const submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", () => {

    //get the user's name from input box
    const playerName = document.getElementById('name-field').value; // set playerName to what was just typed in the field
    socket.emit('new user', playerName);

})

// Test button to request a question (eventually, have this triggered by submitting your name)
const questionButton = document.getElementById("get-question");
questionButton.addEventListener("click", () => {
    socket.emit('getquestion');
    console.log("requesting a question");
})

// Log anything we receive with the key "user scores"
socket.on('user scores', (data) => {
    console.log(data);
})

// When we receive a question, display it
socket.on('question', (question, options) => {
    isAnswered = false;
    removeIntro();
    console.log(question);
    console.log(options);

    //create new div for question and add a paragraph with the question text
    let quizDiv = document.getElementById('quiz');
    let questionText = document.createElement('p');
    quizDiv.id = "question";
    quizDiv.className = "question";
    questionText.innerHTML = question;
    quizDiv.appendChild(questionText);
    document.body.appendChild(quizDiv);

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

        // add avatar to the button
        let avatarURL = "./avatars/" + options[i] + ".png";
        option.style.backgroundImage = `url(${avatarURL})`;

        // add option text below the avatar
        option.innerHTML = options[i];
        optionsDiv.appendChild(option);

        // when player selects answer
        let optionButton = document.getElementById("option" + i);
        optionButton.onclick = function () {
            if (!isAnswered) {
                socket.emit("answer", i);
                console.log("Player answered: " + i);
                isAnswered = true;
            }
        }
    }

})

// Function to remove intro when quiz starts
function removeIntro() {
    let intro = document.getElementById('intro');
    intro.remove;
}

// Function to remove question when next question loaded