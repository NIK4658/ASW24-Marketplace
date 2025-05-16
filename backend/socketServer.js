const { Server } = require('socket.io');

const userSocketMap = {}; // username => socket.id

module.exports = (server, sessionMiddleware, corsRule) => {
  const io = new Server(server, { cors: corsRule });
  io.engine.use(sessionMiddleware);

  io.on('connection', (socket) => {

    const session = socket.request.session?.user;

    if (session !== undefined && session.username) {
      userSocketMap[session.username] = socket.id;
      console.log(`User ${session.username} connected with socket ${socket.id}`);
    }

    //Receive Buy event from client
    socket.on('buyNotificationServer', async ({ targetUser }) => {
      const targetSocketId = userSocketMap[targetUser];
      if (targetSocketId) {
        io.to(targetSocketId).emit('buyNotificationClient');
        console.log(`Utente ${targetUser} notificato correttamente`);
      } else {
        console.log(`Utente ${targetUser} non notificato`);
      }
    });

    //Receive Review event from client
    socket.on('reviewNotificationServer', async ({ targetUser }) => {
      const targetSocketId = userSocketMap[targetUser];
      if (targetSocketId) {
        io.to(targetSocketId).emit('reviewNotificationClient');
        console.log(`Utente ${targetUser} notificato correttamente`);
      } else {
        console.log(`Utente ${targetUser} non notificato`);
      }
    });

    //Receive Message event from client
    socket.on('sendMessageNotificationServer', async ({ targetUser }) => {
      const targetSocketId = userSocketMap[targetUser];
      if (targetSocketId) {
        io.to(targetSocketId).emit('newMessageNotificationClient');
        console.log(`Utente ${targetUser} notificato correttamente`);
      } else {
        console.log(`Utente ${targetUser} non notificato`);
      }
    });

    //Join user to room
    socket.on("joinRoom", async ({ roomId, username }) => {
      socket.join(roomId);
      console.log('User ' + username + ' joined room ' + roomId);
    });

    //Discconnect user from room
    socket.on('leaveRoom', async ({ roomId, username }) => {
      socket.leave(roomId);
      console.log('User ' + username + ' left room ' + roomId);
    });

    // Handle chat message sending in a room
    socket.on('sendMessage', ({ message, roomId }) => {
      console.log('Message sent to destinatary: ' + roomId + ': ' + message);
      socket.to(roomId).emit('receiveMessage', message);
      console.log('Message sent to origin: ' + roomId + ': ' + message);
      socket.emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
      if (session !== undefined) {
        console.log('User disconnected ' + session.username);
        if (session.username && userSocketMap[session.username] === socket.id) {
          delete userSocketMap[session.username];
        }
      }
    });
  });
};