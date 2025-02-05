const express = require('express');
const router = express.Router();
const controller = require('../controllers/chatController');

router.route('/')
  .post(controller.logChat);

router.route('/:userId')
  .get(controller.getPreviewsByUser);

router.route('/between/:userId1/:userId2')
  .get(controller.getChatsBetweenUsers)
  .post(controller.readChatsBetweenUsers)
  .delete(controller.deleteChatsBetweenUsers);

module.exports = router;