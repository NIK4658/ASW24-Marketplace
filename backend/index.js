const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs')
const cors = require('cors')
const session = require('express-session')
const http = require('http')
const socketServer = require('./socketServer')

const app = express()
const server = http.createServer(app)

let settings = {
  mongo: {
    protocol: 'mongodb',
    username: '',
    password: '',
    host: 'localhost',
    port: 27017,
    database: 'webProject',
    authSource: 'admin'
  },
  sessionSecret: 'sessionSecret123',
  jwt: {
    secret: 'jwtSecret123',
    expires: '1d'
  }
}

try {
  const rawSettings = fs.readFileSync('./settings.json')
  const parsed = JSON.parse(rawSettings)
  settings = { ...settings, ...parsed }
  console.log('Loaded settings.json')
} catch (error) {
  console.warn('⚠️ settings.json not found or invalid, using default settings.')
}

const sessionMiddleware = session({
  secret: settings.sessionSecret,
  credentials: true,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 24 * 1000, // 24 hours
    httpOnly: true
  }
})

const corsRule = {
  origin: true,
  credentials: true
}

// Connect to MongoDB
const mongo = settings.mongo
const connectionString = mongo.username
  ? `${mongo.protocol}://${mongo.username}:${mongo.password}@${mongo.host}:${mongo.port}/${mongo.database}?authSource=${mongo.authSource}`
  : `${mongo.protocol}://${mongo.host}:${mongo.port}/${mongo.database}`

mongoose.connect(connectionString)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

// Middlewares
app.use(cors(corsRule))
app.use(sessionMiddleware)
app.use(express.static('public'))
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ limit: '100mb', extended: true }))

// Routes
const userRouter = require('./src/routes/userRouter')(settings.jwt)
const postRouter = require('./src/routes/postRouter')
const reviewRouter = require('./src/routes/reviewRouter')
const chatRouter = require('./src/routes/chatRouter')
const roomRouter = require('./src/routes/roomRouter')
app.use('/users', userRouter)
app.use('/posts', postRouter)
app.use('/review', reviewRouter)
app.use('/chat', chatRouter)
app.use('/room', roomRouter)

// Socket setup
socketServer(server, sessionMiddleware, corsRule)

// Start the server
server.listen(3000, () => {
  console.log('Server listening on port 3000')
})
