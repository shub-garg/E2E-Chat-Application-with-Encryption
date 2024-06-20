# Secure Chat Application

This project is a real-time chat application built with Node.js, Express, and Socket.io, featuring end-to-end encryption (E2EE) for secure messaging. Users can join chat rooms, send messages, and use emojis, all while ensuring that their conversations remain private and secure.

## Features

- **Real-time Communication**: Instant messaging using WebSockets via Socket.io.
- **End-to-End Encryption**: Messages are encrypted on the sender's side and decrypted on the recipient's side, ensuring privacy and security.
- **Public Key Exchange**: Each user generates a public/private key pair, with public keys exchanged to enable encryption.
- **Multiple Chat Rooms**: Users can join existing chat rooms or create new ones.
- **Emoji Support**: Users can include emojis in their messages using an emoji picker.
- **User List and Room Information**: Display of current users in the chat room and the room name.

![chat app](https://github.com/shub-garg/E2E-Chat-Application-with-Encryption/assets/52582943/ffa48cdc-c24b-4c0a-95e2-ca46d914834f)


## Technologies Used

- **Node.js**: Backend server
- **Express**: Web framework for Node.js
- **Socket.io**: Real-time communication library
- **Web Cryptography API**: Browser API for cryptographic operations
- **HTML/CSS/JavaScript**: Frontend technologies

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/secure-chat-app.git
cd secure-chat-app
```

2. Install dependencies:
```bash
npm install name
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```arduino
http://localhost:3000
```
## Usage
1. On the home page, enter your username and select a chat room or create a new one.
2. Join the chat room and start sending encrypted messages.
3. Use the emoji picker to add emojis to your messages.
4. See a list of current users in the chat room and the room name on the sidebar.

## Future Enhancements
1. User Authentication: Implementing user authentication for added security.
2. Message History: Storing and retrieving past messages.
3. File Sharing: Enabling secure file sharing between users.
