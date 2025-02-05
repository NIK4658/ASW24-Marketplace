const { Server } = require('socket.io');

module.exports = (server, sessionMiddleware, corsRule) => {
  const io = new Server(server, { cors: corsRule });
  io.engine.use(sessionMiddleware);

  io.on('connection', (socket) => {
    const session = socket.request.session;
    console.log('User connected ');

    socket.on("joinRoom", async ({ roomId }) => {
      socket.join(roomId);
      console.log('User ' + session.user + ' joined room ' + roomId);
    });

    socket.on("sendMessage", async ({ chat, roomId }) => {
      io.to(roomId).emit("receiveMessage", chat);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected ' + session.user);
      session.destroy();
    });
  });
};