const {postModel} = require('../model/postModel')
const {reviewModel} = require('../model/reviewModel')
const {userModel} = require('../model/userModel')
const mongoose = require('mongoose')

exports.createReview = async (req, res) => {
    const { buyer, seller, post, score, title, description } = req.body;

    try {
        const userBuyer = await userModel.findOne({ username: buyer });
        if (!userBuyer) {
            return res.status(404).json({ message: 'Buyer not found' });
        }

        const userSeller = await userModel.findOne({ username: seller });
        if (!userSeller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        if (userBuyer._id.equals(userSeller._id)) {
            return res.status(400).json({ message: 'Buyer and seller cannot be the same user' });
        }

        const productPost = await postModel.findById(post);
        if (!productPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!productPost.seller.equals(userSeller._id)) {
            return res.status(400).json({ message: 'Seller does not match the seller of the post' });
        }

        if (productPost.buyer && !productPost.buyer.equals(userBuyer._id)) {
            return res.status(400).json({ message: 'Buyer does not match the buyer of the post' });
        }

        const existingReview = await reviewModel.findOne({
            buyer: userBuyer._id,
            seller: userSeller._id,
            post: productPost._id,
        });
        if (existingReview) {
            return res.status(400).json({ message: 'Review already exists for this buyer, seller, and post' });
        }

        const newReview = new reviewModel({
            buyer: userBuyer._id,
            seller: userSeller._id,
            post: productPost._id,
            score,
            title,
            description,
        });

        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating review', error });
    }
};

exports.getAllUserReview = (req, res) => {
  const userId = req.params.id;
  reviewModel.find({seller: userId})
    .exec()
    .then(reviews => {
      if (reviews.length > 0) {
        res.status(200).json(reviews);
      } else {
        res.status(404).json({message: 'No reviews found for this seller'});
      }
    })
    .catch(() => {
      res.status(500).json({message: 'Error searching user reviews'});
    });
};

exports.deleteReview = (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({message: 'Invalid review ID'})
  }
  reviewModel.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        return res.status(404).json({message: 'Review not found'})
      }
      res.json({message: 'Review deleted successfully', deletedReview: result})
    })
    .catch((error) => {
      res.status(500).json(error)
    })
}