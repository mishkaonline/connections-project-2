window.addEventListener('load', () => {
    document.getElementById('menu-button').addEventListener('click', () => {
        openNav();
        console.log("menu button clicked");
    });

    document.getElementById('submit-button').addEventListener('click', () => {
        let answer = document.getElementById('name').value;
        let question = document.getElementById('fact').value;
        let data = { question, answer };

        console.log(data);

        // Fetch request (type POST) to send the name and fact to the server

        fetch('/funFact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);

                // Display a message to the user to let them know the fact was submitted
                if (data.task == "success") {
                    let submitDiv = document.getElementById('submit-form');
                    let successMessage = document.createElement('p');
                    successMessage.id = "success-message";
                    successMessage.classList.add("success");
                    submitDiv.appendChild(successMessage);
                    successMessage.innerHTML = "Thanks, your fact is now in the game!";

                    // Clear the input fields
                    document.getElementById('name').value = "";
                    document.getElementById('fact').value = "";
                }
            })
    });
});

function openNav() {
    document.getElementById("myNav").style.width = "100%";
}