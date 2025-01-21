const express = require('express');
const router = express.Router();
const controller = require('../controllers/reviewController');

router.route('/')
  .post(controller.createReview);

router.route('/:id')
  .get(controller.getAllUserReview)
  .delete(controller.deleteReview);

module.exports = router;