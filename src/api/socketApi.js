const socketio = require('socket.io');
const io = socketio();

const socketApi = {
    io
};


io.on('connection', socket => {
    console.log("User connected");


});

module.exports = socketApi;