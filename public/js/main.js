const socket = io();
const chatmsgs = document.querySelector('.chat-messages');
const chatForm = document.getElementById('chat-form');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const emojiBtn = document.getElementById('emoji-btn');
const emojiPicker = document.getElementById('emoji-picker');
const msgInput = document.getElementById('msg');

let publicKey;
let privateKey;
let recipientPublicKeys = {};

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Join chatroom
socket.emit('joinRoom', { username, room });

// Generate key pair and share public key
generateKeyPair().then(() => {
    socket.emit('publicKey', { username, room, publicKey: arrayBufferToBase64(publicKey) });
}).catch(err => console.error('Key pair generation failed:', err));

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
    users.forEach(user => {
        if (user.username !== username) {
            recipientPublicKeys[user.username] = user.publicKey;
        }
    });
});

// Message from server
socket.on('message', async message => {
    try {
        if (message.username !== 'Chat Bot') {
            message.text = await decryptMessage(message.text);
        }
        outputmsg(message);
        chatmsgs.scrollTop = chatmsgs.scrollHeight;
    } catch (err) {
        console.error('Message decryption failed:', err);
    }
});

// Message submit
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value;

    // Encrypt the message for each recipient
    try {
        const encryptedMessages = await encryptMessageForAll(msg);
        // Emit encrypted message to server
        socket.emit('chatmsg', encryptedMessages);
    } catch (err) {
        console.error('Message encryption failed:', err);
    }

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

// Generate key pair
async function generateKeyPair() {
    try {
        const keyPair = await window.crypto.subtle.generateKey({
            name: "RSA-OAEP",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        }, true, ["encrypt", "decrypt"]);

        publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
        privateKey = keyPair.privateKey;
        console.log('Key pair generated successfully.');
    } catch (err) {
        console.error('Key pair generation error:', err);
        throw err;
    }
}

// Encrypt message for all recipients
async function encryptMessageForAll(message) {
    const encryptedMessages = {};

    for (const [username, pubKey] of Object.entries(recipientPublicKeys)) {
        try {
            const importedPublicKey = await window.crypto.subtle.importKey(
                'spki',
                base64ToArrayBuffer(pubKey),
                {
                    name: "RSA-OAEP",
                    hash: "SHA-256"
                },
                true,
                ["encrypt"]
            );

            const encryptedMessage = await window.crypto.subtle.encrypt(
                {
                    name: "RSA-OAEP"
                },
                importedPublicKey,
                new TextEncoder().encode(message)
            );

            encryptedMessages[username] = arrayBufferToBase64(encryptedMessage);
        } catch (err) {
            console.error(`Encryption error for recipient ${username}:`, err);
            throw err;
        }
    }

    return encryptedMessages;
}

// Decrypt message
async function decryptMessage(encryptedMessage) {
    try {
        const decryptedMessage = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            privateKey,
            base64ToArrayBuffer(encryptedMessage)
        );

        return new TextDecoder().decode(decryptedMessage);
    } catch (err) {
        console.error('Decryption error:', err);
        throw err;
    }
}

// Utility functions
function arrayBufferToBase64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

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
