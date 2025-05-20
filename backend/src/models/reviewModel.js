const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true,
  },
  score: {
    type: Number, min: 1, max: 5, required: true,
  },
  title: {
    type: String, required: true
  },
  description: {
    type: String
  }
}, {timestamps: true})

reviewSchema.index({buyer: 1, seller: 1, post: 1}, {unique: true});
reviewSchema.index({seller: 1});

const reviewModel = mongoose.model('Review', reviewSchema)

module.exports = {reviewModel}
