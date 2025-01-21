const express = require('express');
const mongoose = require('mongoose');
const settings = require('./settings.json');
const mongoCredentials = settings.mongo;
const userRouter = require('./src/routes/userRouter')
const postRouter = require('./src/routes/postRouter')
const reviewRouter = require('./src/routes/reviewRouter')
const jwt = require('jsonwebtoken');
const jwtSettings = settings.jwt;
const cors = require('cors');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

mongoose.connect(
  `${mongoCredentials.protocol}://${mongoCredentials.username}:${mongoCredentials.password}@${mongoCredentials.host}:${mongoCredentials.port}/${mongoCredentials.database}?authSource=${mongoCredentials.authSource}`)

// mongoose.connect('mongodb://localhost:27017/webProject');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/review', reviewRouter);

io.on('connection', (socket) => {

  socket.on('auth', (token, callback) => {
    jwt.verify(token, jwtSettings.secret, (err, decoded) => {
      if (err) {
        return socket.emit('auth', {error: 'Invalid token'});
      }
      callback({success: true, message: 'Authenticated'});
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  //   Todo: Handle user disconnection
  });

});


app.listen(3000, () => {
  console.log('Server listening on port 3000');
});