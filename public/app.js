let socket = io();
//socket.emit('new user', "test");


const submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", () => {

    //get the user's name from input box
    const playerName = document.getElementById('name-field').value; // set playerName to what was just typed in the field
    socket.emit('new user', playerName);

})

// Test button to request a question
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
    console.log(question);
    console.log(options);

    //create new div for question and add a paragraph with the question text
    let questionDiv = document.createElement('div');
    let questionText = document.createElement('p');
    questionDiv.id = "question";
    questionDiv.className = "question";
    questionText.innerHTML = question;
    questionDiv.appendChild(questionText);
    document.body.appendChild(questionDiv);

    //create new div for options
    let optionsDiv = document.createElement('div');
    optionsDiv.id = "options";
    optionsDiv.className = "options";
    questionDiv.appendChild(optionsDiv);

    // create a button for each option
    for (let i = 0; i < options.length; i++) {
        let option = document.createElement('button');
        option.id = "option" + i;
        option.innerHTML = options[i];
        optionsDiv.appendChild(option);
    }

})
