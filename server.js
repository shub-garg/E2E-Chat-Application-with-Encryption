const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const socketio = require('socket.io');
const bodyParser = require('body-parser');

const server = http.createServer(app);
const io = socketio(server);
const formatmsg = require('./utils/messages');
const { userJoin, getCurrUser, userLeave, getRoomUsers } = require('./utils/users');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let rooms = ['JavaScript', 'Python', 'PHP', 'C#', 'Ruby', 'Java'];

const bot = 'Chat Bot';

app.post('/create-room', (req, res) => {
    const { room } = req.body;
    if (!rooms.includes(room)) {
        rooms.push(room);
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.get('/rooms', (req, res) => {
    res.json({ rooms });
});

io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        socket.emit('message', formatmsg(bot, 'Welcome to Chat!'));
        socket.broadcast.to(user.room).emit('message', formatmsg(bot, `${user.username} has joined the chat`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    socket.on('chatmsg', msg => {
        const user = getCurrUser(socket.id);
        io.to(user.room).emit('message', formatmsg(user.username, msg));
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatmsg(bot, `${user.username} has left the chat`));
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
