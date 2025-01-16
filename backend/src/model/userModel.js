const mongoose = require('mongoose');
const postSchema = require('./postModel');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  posts: [postSchema],
}, { timestamps: true });

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
