const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.route('/')
  .get(controller.getAllUsers)
  .post(controller.createUser);

router.route('/:username')
  .get(controller.searchByUsername)
  .delete(controller.deleteUser);

module.exports = router;