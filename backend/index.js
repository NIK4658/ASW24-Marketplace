const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./src/routes/userRouter')
const postRouter = require('./src/routes/postRouter')
const reviewRouter = require('./src/routes/reviewRouter')
const cors = require('cors');

mongoose.connect('mongodb://root:rc43ogjdi9mdw3@detu.ddns.net:27017/webProject?authSource=admin');
// mongoose.connect('mongodb://localhost:27017/dbMovies');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/review', reviewRouter);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});