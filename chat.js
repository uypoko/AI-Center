document.getElementById('send-button').addEventListener('click', function () {
    const userInput = document.getElementById('user-input').value.trim();
    const chatWindow = document.getElementById('chat-window');

    if (userInput) {
        displayMessage(userInput, 'user');
        document.getElementById('user-input').value = '';

        // Send message to the backend
        fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ message: userInput })
        })
        .then(response => response.json())
        .then(data => {
            displayMessage(data.response, 'ai');
        })
        .catch(err => {
            displayMessage('Error connecting to server', 'ai');
            console.error('Error:', err);
        });
    }
});

document.getElementById('logout-button').addEventListener('click', function () {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});

function displayMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = text;
    const chatWindow = document.getElementById('chat-window');
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

window.onload = function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
};
