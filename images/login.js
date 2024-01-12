
// JavaScript to show the message and clear the form
const messageContainer = document.getElementById("message-container");
const messageContent = document.getElementById("message-content");
const form = document.querySelector("form");

// Check if the message should be displayed (you can set this condition based on your logic)
const shouldDisplayMessage = true;

if (shouldDisplayMessage) {
    messageContent.textContent = "User does not exist. Please sign up!!";
    messageContainer.style.display = "block";
    form.reset(); // Clear the form
}
