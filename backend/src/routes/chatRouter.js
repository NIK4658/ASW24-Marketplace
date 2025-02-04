const express = require('express');
const router = express.Router();
const controller = require('../controllers/chatController');

router.route('/')
  .post(controller.createChat);

router.route('/:userId')
  .get(controller.getChatsByUser);