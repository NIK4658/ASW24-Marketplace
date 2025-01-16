const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  condition: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
}, { _id: false });

const postModel = mongoose.model('Post', postSchema);

module.exports = postModel;
