const express = require('express');
const router = express.Router();
const controller = require('../controllers/roomController');

router.route('/')
  .post(controller.createRoom);

router.route('/:roomId')
  .delete(controller.deleteRoom);

module.exports = router;
