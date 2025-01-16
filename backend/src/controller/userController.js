const { userModel } = require('../model/userModel')
const bcrypt = require('bcrypt')

exports.searchByUsername = (req, res) => {
  userModel.findOne({ username: req.params.username })
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.json(result)
    })
    .catch((error) => {
      res.status(500).json(error)
    })
}

exports.createUser = (req, res) => {
  const { username, email, password } = req.body

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Error while encrypting password', error: err })
    }

    const user = new userModel({
      username, email, password: hashedPassword
    })

    user.save()
      .then((result) => {
        res.json(result)
      })
      .catch((error) => {
        res.status(500).json({ message: 'Error creating the user', error })
      })
  })
}

exports.deleteUser = (req, res) => {
  const username = req.params.username
  const password = req.body.password

  // Search user by username
  userModel.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Compare password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: 'Server error during password comparison' })
        }

        if (!isMatch) {
          return res.status(401).json({ message: 'Incorrect password' })
        }

        // Delete user if password is correct
        userModel.deleteOne({ username })
          .then(() => {
            res.json({ message: 'User deleted successfully' })
          })
          .catch((error) => {
            res.status(500).json({ message: 'Error deleting user', error })
          })
      })
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error finding user', error })
    })
}

exports.getAllUsers = (req, res) => {
  userModel.find()
    .then((result) => {
      res.json(result)
    })
    .catch((error) => {
      res.status(500).json(error)
    })
}