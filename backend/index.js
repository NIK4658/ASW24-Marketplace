const express = require('express')
const mongoose = require('mongoose')
const settings = require('./settings.json')
const mongoCredentials = settings.mongo
const userRouter = require('./src/routes/userRouter')
const postRouter = require('./src/routes/postRouter')
const reviewRouter = require('./src/routes/reviewRouter')
const chatRouter = require('./src/routes/chatRouter')
const cors = require('cors')
const session = require('express-session')
const http = require('http')
const { Server } = require('socket.io')
const app = express()
const server = http.createServer(app)

const sessionMiddleware = session({
  secret: settings.sessionSecret,
  credentials: true,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 24 * 1000, // 24 hours
    httpOnly: true
  }
})

const corsRule = {
  origin: true,
  credentials: true
}

mongoose.connect(`${mongoCredentials.protocol}://${mongoCredentials.username}:${mongoCredentials.password}@${mongoCredentials.host}:${mongoCredentials.port}/${mongoCredentials.database}?authSource=${mongoCredentials.authSource}`)

app.use(cors(corsRule))
app.use(sessionMiddleware)

app.use(express.static('public'))
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ limit: '100mb', extended: true }))

app.use('/users', userRouter)
app.use('/posts', postRouter)
app.use('/review', reviewRouter)
app.use('/chat', chatRouter)

const io = new Server(server, { cors: corsRule })
io.engine.use(sessionMiddleware)

io.on('connection', (socket) => {
  const session = socket.request.session
  console.log('User connected ')


  socket.on('test', (data) => {
    console.log(data)
    socket.emit('test', 'Hello from server')
  })

  socket.on('disconnect', () => {
    console.log('User disconnected ' + session.user)
    session.destroy()
  })

  socket.on('message', (data) => {
    console.log(data)
  })
})

server.listen(3000, () => {
  console.log('Server listening on port 3000')
})