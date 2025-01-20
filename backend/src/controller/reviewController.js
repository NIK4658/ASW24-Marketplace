const {postModel} = require('../model/postModel')
const {reviewModel} = require('../model/reviewModel')
const {userModel} = require('../model/userModel')
const mongoose = require('mongoose')

exports.createReview = (req, res) => {
  const {buyer, seller, post, score, title, description} = req.body;

  userModel.findOne({username: buyer})
    .then((userBuyer) => {
      if (!userBuyer) {
        return res.status(404).json({message: 'Buyer not found'});
      }

      userModel.findOne({username: seller})
        .then((userSeller) => {
          if (!userSeller) {
            return res.status(404).json({message: 'Seller not found'});
          }

          if ((userBuyer._id).equals(userSeller._id)) {
            return res.status(500).json({
              message:
                'Error, the seller and the buyer are the same user'
            });
          }

          postModel.findById(post)
            .then((productPost) => {
              if (!productPost) {
                return res.status(404).json({message: 'Post not found'});
              }

              if (!(productPost.user).equals(userSeller._id)) {
                return res.status(500).json({
                  message:
                    'Error, seller is not the seller of the post'
                });
              }

              const newReview = new reviewModel({
                buyer: userBuyer,
                seller: userSeller,
                post: productPost,
                score: score,
                title: title,
                description: description,
              });

              newReview.save()
                .then((savedReview) => {
                  res.status(201).json(savedReview);
                })
                .catch((error) => {
                  console.error(error);
                  res.status(500).json({message: 'Error saving the review', error});
                });
            })
        })
    })
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