const express = require('express');
const router = express.Router();
const controller = require('../controller/userController');

router.route('/')
  .get(controller.getAllUsers)
  .post(controller.createUser);

router.route('/:username')
  .get(controller.searchByUsername)
  .delete(controller.deleteUser);

module.exports = router;