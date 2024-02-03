// client.js
const socket = io();
console.log('Работакт');
socket.on('connect', () => {
    socket.emit('getInitialMessages');
});

socket.on('initialMessages', (messages) => {
    messages.forEach((message) => {
        displayMessage(message.text, message.time);
    });
});

socket.on('message', (data) => {
    displayMessage(data.message, data.time);
});

function sendMessage() {
    console.log('sendMessage function called')
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value;
    socket.emit('message', { message: messageText });
    messageInput.value = '';
}

function displayMessage(message, time) {
    const messageDisplay = document.getElementById('messageDisplay');
    const newMessage = document.createElement('div');
    const messageContent = document.createElement('p');
    const messageTime = document.createElement('p');
    messageContent.textContent = message;
    messageTime.textContent = time;
    newMessage.classList.add('message');
    newMessage.appendChild(messageContent);
    newMessage.appendChild(messageTime);
    messageDisplay.appendChild(newMessage);
}
