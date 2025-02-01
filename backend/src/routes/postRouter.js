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

router.route('/search/:title')
  .get(controller.searchPostByTitle);

module.exports = router;