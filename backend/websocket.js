const { Server } = require('socket.io')

function initializeWebSocket(server, sessionMiddleware, corsRule) {
  const io = new Server(server, { cors: corsRule })

  io.engine.use(sessionMiddleware)

  io.on('connection', (socket) => {
    const session = socket.request.session
    console.log('User connected')



    socket.on('disconnect', () => {
      console.log('User disconnected ' + session.user)
      session.destroy()
    })
  })

  return io
}

module.exports = initializeWebSocket