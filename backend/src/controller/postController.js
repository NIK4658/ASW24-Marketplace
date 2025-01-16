const { postModel } = require('../model/postModel')

exports.searchPost = (req, res) => {
  postModel.find()
    .then((result) => {
      res.json(result)
    })
    .catch((error) => {
      res.json(error)
    })
}

exports.createPost = (req, res) => {
  const post = new postModel(req.body)
  post.save()
    .then((result) => {
      res.json(result)
    })
    .catch((error) => {
      res.json(error)
    })
}

exports.updatePost = (req, res) => {
  postModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: 'Post not found' })
      }
      res.json(result)
    })
    .catch((error) => {
      res.status(500).json(error)
    })
}

exports.deletePost = (req, res) => {
  postModel.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: 'Post not found' })
      }
      res.json({ message: 'Post deleted successfully', deletedPost: result })
    })
    .catch((error) => {
      res.status(500).json(error)
    })
}

exports.listPosts = (req, res) => {
  postModel.find()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error retrieving posts', error });
    });
};


