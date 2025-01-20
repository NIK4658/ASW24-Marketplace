const express = require('express');
const router = express.Router();
const controller = require('../controller/postController');

router.route('/')
  .get(controller.getAllPosts )
  .post(controller.createPost);

router.route('/:id')
  .get(controller.searchPost)
  .put(controller.updatePost)
  .delete(controller.deletePost);

module.exports = router;