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
