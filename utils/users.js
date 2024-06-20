const users = [];

// Join user to room
function userJoin(id, username, room) {
    const user = { id, username, room, publicKey: null };
    users.push(user);
    return user;
}

// Get current user
function getCurrUser(id) {
    return users.find(user => user.id === id);
}

// User leaves
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

// Save public key
function savePublicKey(username, publicKey) {
    const user = users.find(user => user.username === username);
    if (user) {
        user.publicKey = publicKey;
    }
}

module.exports = {
    userJoin,
    getCurrUser,
    userLeave,
    getRoomUsers,
    savePublicKey
};
