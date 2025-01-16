const { postModel } = require('../model/postModel')
const { userModel } = require('../model/userModel')
const mongoose = require('mongoose')

exports.createPost = (req, res) => {
  const { username, title, price, condition, description } = req.body

  userModel.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const newPost = new postModel({
        title, price, condition, description, user: user._id
      })

      newPost.save()
        .then((result) => {
          res.status(201).json(result)
        })
        .catch((error) => {
          res.status(500).json({ message: 'Error creating the post', error })
        })
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error finding user', error })
    })
}

exports.getAllPosts = (req, res) => {
  postModel.find()
    .populate('user', 'username email')
    .then((posts) => {
      if (posts.length === 0) {
        return res.status(404).json({ message: 'No posts found' })
      }
      res.json(posts)
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error fetching posts', error })
    })
}

exports.deletePost = (req, res) => {
  const id = req.params.id

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid post ID' })
  }

  postModel.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: 'Post not found' })
      }
      res.json({ message: 'Post deleted successfully', deletedPost: result })
    })
    .catch((error) => {
      res.status(500).json(error)
    })
}

exports.searchPost = (req, res) => {
  const id = req.params.id

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid post ID' })
  }

  postModel.findById(id)
    .populate('user', 'username email')
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: 'Post not found' })
      }
      res.json(result)
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error retrieving post', error })
    })
}

exports.updatePost = (req, res) => {
  const id = req.params.id

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid post ID' })
  }

  const { title, price, condition, description } = req.body

  postModel.findByIdAndUpdate(id, {
    title, price, condition, description
  }, { new: true })
    .then((updatedPost) => {
      if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found' })
      }
      res.json(updatedPost)
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error updating the post', error })
    })
}