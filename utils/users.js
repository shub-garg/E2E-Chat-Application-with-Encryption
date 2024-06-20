const users = [];

// Join user to room

function userJoin(id, username, room){
    const user = {id, username, room};
    users.push(user);
    return user;
}

// Get curr user

function getCurrUser (id){
    return users.find(user => user.id === id);
}


//User leaves

function userLeave(id){
    const index = users.findIndex(user => user.id === id);

    if (index !== -1){
        return users.splice(index,1)[0];
    }
}

// Get room users

function getRoomUsers(room){
    return users.filter(user => user.room === room);
}


module.exports = {
    userJoin,
    getCurrUser,
    userLeave,
    getRoomUsers
};