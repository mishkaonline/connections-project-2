let socket = io();
//socket.emit('new user', "test");

const submitNameButton = document.getElementById("name-submit");
submitNameButton.addEventListener("click", () => {
    //get the user's name from input box
    const nameField = document.getElementById('name-field').value;
    socket.emit('new user', nameField);
})

socket.on('user scores', (data) => {
    console.log(data);
})