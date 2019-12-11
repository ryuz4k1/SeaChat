const config                        = require('../../config.json');
const redisAdapter                  = require('socket.io-redis');
const SocketAuthorizationMiddleware = require('../middleware/socket-authorization-middleware');

const socketio = require('socket.io');
const io = socketio();

const socketApi = {
    io
};

const Users     = require("../lib/Users");
const Rooms     = require("../lib/Rooms");
const Messages  = require("../lib/Messages");

// ... Socketio Middleware
const socketAuthorizationMiddleware = new SocketAuthorizationMiddleware();
io.use(socketAuthorizationMiddleware.socketAuthorization());

// ... Redis Adapter
io.adapter(redisAdapter({
    host: config.REDIS_URI, 
    port: config.REDIS_PORT 
}));


io.on('connection', (socket) => {
    //console.log("User connected", socket.request.user);

    Rooms.list(rooms => {
		  io.emit('roomList', rooms);
    });

    Users.list(users => {
		  io.emit('onlineList', users);
    });
    
    Users.upsert(socket.id, socket.request.user);

    socket.on('newMessage', data => {
      const messageData = {
        ...data,
        userId: socket.request.user._id,
        username: socket.request.user.name,
        surname: socket.request.user.surname,
      };
  
      Messages.upsert(messageData);
      socket.broadcast.emit('receiveMessage', messageData);
    });

    socket.on('newRoom', roomName => {
		Rooms.upsert(roomName);
		Rooms.list(rooms => {
			io.emit('roomList', rooms);
		});
	});

  socket.on('disconnect', () => {
		Users.remove(socket.request.user._id);

		Users.list(users => {
			io.emit('onlineList', users);
		});
	});

});

module.exports = socketApi;