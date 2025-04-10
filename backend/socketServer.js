const { Server } = require('socket.io');

const userSocketMap = {}; // username => socket.id

module.exports = (server, sessionMiddleware, corsRule) => {
  const io = new Server(server, { cors: corsRule });
  io.engine.use(sessionMiddleware);

  io.on('connection', (socket) => {
    const session = socket.request.session.user;

    if (session !== undefined && session.username) {
      userSocketMap[session.username] = socket.id;
      console.log(`User ${session.username} connected with socket ${socket.id}`);
    }

    socket.on("joinRoom", async ({ roomId }) => {
      socket.join(roomId);
      console.log('User ' + session.user + ' joined room ' + roomId);
    });

    socket.on("sendMessage", async ({ chat, roomId }) => {
      io.to(roomId).emit("receiveMessage", chat);
    });

    //Receive event from client
    socket.on('buyNotificationServer', async ({ targetUser }) => {
      const targetSocketId = userSocketMap[targetUser];
      if (targetSocketId) {
        io.to(targetSocketId).emit('buyNotificationClient');
        console.log(`Utente ${targetUser} notificato correttamente`);
      } else {
        console.log(`Utente ${targetUser} non notificato`);
      }
    });

    socket.on('disconnect', () => {
      if (session !== undefined){
        console.log('User disconnected ' + session.username);
        if (session.username && userSocketMap[session.username] === socket.id) {
          delete userSocketMap[session.username];
        }
        //session.destroy();
      }
    });
  });
};