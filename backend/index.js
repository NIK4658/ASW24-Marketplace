const express = require('express');
const mongoose = require('mongoose');
const settings = require('./settings.json');
const mongoCredentials = settings.mongo;
const userRouter = require('./src/routes/userRouter');
const postRouter = require('./src/routes/postRouter');
const reviewRouter = require('./src/routes/reviewRouter');
const jwt = require('jsonwebtoken');
const jwtSettings = settings.jwt;
const cors = require('cors');
const session = require('express-session');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

mongoose.connect(
  `${mongoCredentials.protocol}://${mongoCredentials.username}:${mongoCredentials.password}@${mongoCredentials.host}:${mongoCredentials.port}/${mongoCredentials.database}?authSource=${mongoCredentials.authSource}`
);

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(session({
  secret: settings.sessionSecret,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 60 * 60 * 24 * 1000 // 24 hours
  }
}));

app.use(express.static('public'));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/review', reviewRouter);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});