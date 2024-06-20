const socket = io();
const chatmsgs = document.querySelector('.chat-messages');
const chatForm = document.getElementById('chat-form');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const emojiBtn = document.getElementById('emoji-btn');
const emojiPicker = document.getElementById('emoji-picker');
const msgInput = document.getElementById('msg');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Message from server
socket.on('message', message => {
    outputmsg(message);
    chatmsgs.scrollTop = chatmsgs.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatmsg', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Show or hide emoji picker
emojiBtn.addEventListener('click', () => {
    emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
});

// Add emoji to input field
emojiPicker.addEventListener('emoji-click', (event) => {
    msgInput.value += event.detail.unicode;
});

// Output message to DOM
function outputmsg(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    if (message.username === 'Chat Bot') {
        div.classList.add('chatbot-message');
    } else {
        div.classList.add('user-message');
    }
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
                     <p class="text">${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}
