const socket = io();
const text = document.querySelector('#text');

function handleKeyDown(event, user) {
    if (event.key === 'Enter') {
        sendMessage(user);
    }
}

function sendMessage(user) {
    if (text.value) {
        socket.emit('saveMessage', user, text.value);
        text.value = '';
    }
}

socket.on('loadMessages', messages => {
    const chatMessages = document.querySelector('#chatMessages');
    chatMessages.innerHTML = '';
    messages.forEach(message => {
        const date = new Date(message.date).toLocaleDateString();
        const hour = new Date(message.date).toLocaleTimeString();
        chatMessages.innerHTML += `<p>${date} ${hour} ${message.user} dijo: ${message.text}</p>`
    });
});