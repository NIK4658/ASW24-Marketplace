const express = require('express');
const router = express.Router();
const controller = require('../controllers/postController');

router.route('/')
  .get(controller.getAllPosts)
  .post(controller.createPost);

router.route('/:id')
  .get(controller.searchPost)
  .post(controller.updatePost)
  .delete(controller.deletePost);

router.route('/user/:username')
  .post(controller.getPostsMadeByUser)

router.route('/user/purchases/:username')
  .post(controller.userPurchasesHistory);

router.route('/user/sales/:username')
  .post(controller.userSalesHistory);

router.route('/search/:title')
  .get(controller.searchPostByTitle);

module.exports = router;