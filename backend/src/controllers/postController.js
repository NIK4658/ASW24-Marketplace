const { postModel } = require('../models/postModel')
const { userModel } = require('../models/userModel')
const defaultImage = require('fs').readFileSync('public/EmptyPost.png')
const mongoose = require('mongoose')

exports.createPost = async (req, res) => {
  try {
    const { title, price, condition, description, sellerUsername, images } = req.body
    if (!title || !price || !condition || !description || !sellerUsername) {
      return res.status(400).json({ error: 'All required fields must be provided.' })
    }
    const formattedImages = images && images.length > 0 ? images.map(image => ({
      data: Buffer.from(image, 'base64'), contentType: 'image/jpeg'
    })) : [{
      data: defaultImage, contentType: 'image/png'
    }]
    const seller = await userModel.findOne({ username: sellerUsername })
    if (!seller) {
      return res.status(404).json({ error: 'Seller not found.' })
    }
    const newPost = new postModel({
      title, price, condition, description, seller: seller._id, images: formattedImages
    })
    const savedPost = await newPost.save()
    res.status(201).json(savedPost)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while creating the post. ' + error })
  }
}

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.find()
      .populate('seller', 'username email')
      .populate('buyer', 'username email')
      .exec()
    const formattedPosts = posts.map(post => {
      const formattedImages = post.images.map(image => ({
        data: image.data.toString('base64'), // Convert Buffer to base64
        contentType: image.contentType
      }))
      return {
        ...post.toObject(),
        images: formattedImages
      }
    })
    res.status(200).json(formattedPosts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong while fetching the posts.' })
  }
}

exports.deletePost = (req, res) => {
  const postId = req.params.id

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid post ID' })
  }

  postModel.findByIdAndDelete(postId)
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

exports.searchPost = async (req, res) => {
  const postId = req.params.id

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid post ID' })
  }
  try {
    const post = await postModel.findById(postId)
      .populate('seller', 'username email') // Populate seller details
      .populate('buyer', 'username email')  // Populate buyer details
      .exec()
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' })
    }

    const formattedImages = post.images.map(image => ({
      data: image.data.toString('base64'), // Convert Buffer to base64
      contentType: image.contentType
    }))
    const formattedPost = {
      ...post.toObject(),
      images: formattedImages
    }

    res.status(200).json(formattedPost)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Something went wrong while searching for the post.' })
  }
}

exports.updatePost = async (req, res) => {
  const postId = req.params.id

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: 'Invalid post ID' })
  }

  try {
    const updates = { ...req.body }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: 'No fields provided to update' })
    }

    const existingPost = await postModel.findById(postId)
    if (!existingPost) {
      return res.status(404).json({ message: 'Post not found' })
    }

    let sellerId = existingPost.seller
    let buyerId = existingPost.buyer

    if (updates.seller) {
      const seller = await userModel.findOne({ username: updates.seller })
      if (!seller) {
        return res.status(404).json({ message: 'Seller not found' })
      }
      sellerId = seller._id
      updates.seller = seller._id
    }

    if (updates.buyer) {
      const buyer = await userModel.findOne({ username: updates.buyer })
      if (!buyer) {
        return res.status(404).json({ message: 'Buyer not found' })
      }
      buyerId = buyer._id
      updates.buyer = buyer._id
    }

    if (sellerId && buyerId && sellerId.toString() === buyerId.toString()) {
      return res.status(400).json({ message: 'Seller and buyer cannot be the same person' })
    }

    if (updates.images && updates.images.length > 0) {
      updates.images = updates.images.map(image => ({
        data: Buffer.from(image, 'base64'),
        contentType: 'image/jpeg'
      }))
    }

    const updatedPost = await postModel.findByIdAndUpdate(postId, updates, { new: true, runValidators: true })
      .populate('seller', 'username email')
      .populate('buyer', 'username email')
      .exec()

    res.status(200).json(updatedPost)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong while updating the post' })
  }
}

exports.getPostsMadeByUser = async (req, res) => {
  const username = req.params.username
  try {
    const user = await userModel.findOne({ username })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const posts = await postModel.find({ seller: user._id }).populate('seller', 'username email')
    const formattedPosts = posts.map(post => {
      const formattedImages = post.images.map(image => ({
        data: image.data.toString('base64'), // Convert Buffer to base64
        contentType: image.contentType
      }))
      return {
        ...post.toObject(),
        images: formattedImages
      }
    })
    res.status(200).json(formattedPosts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching posts', error })
  }
}

exports.searchPostByTitle = async (req, res) => {
  try {
    const title = req.params.title;
    const posts = await postModel.find({ title: new RegExp(title, 'i') });
    const formattedPosts = posts.map(post => {
      const formattedImages = post.images.map(image => ({
        data: image.data.toString('base64'), // Convert Buffer to base64
        contentType: image.contentType
      }));
      return {
        ...post.toObject(),
        images: formattedImages
      };
    });
    res.status(200).json(formattedPosts);
  } catch (error) {
    console.error('Error searching posts by title: ', error);
    res.status(500).json({ message: 'Error searching posts by title', error });
  }
};

exports.userOrderHistory = async (req, res) => {
  const username = req.params.username
  try {
    const user = await userModel.findOne({ username })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const posts = await postModel.find({ buyer: user._id })
    const formattedPosts = posts.map(post => {
      const formattedImages = post.images.map(image => ({
        data: image.data.toString('base64'), // Convert Buffer to base64
        contentType: image.contentType
      }))
      return {
        ...post.toObject(),
        images: formattedImages
      }
    })
    res.status(200).json(formattedPosts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching posts', error })
  }
};