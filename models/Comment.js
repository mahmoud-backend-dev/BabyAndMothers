const mongoose = require('mongoose');


const commentSchame = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, "Comment must belongs to a post"]
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "your name for comment"],
  },
  text: {
    type: String,
    required: true,
  }
}, { timestamps: true });


module.exports = mongoose.model('Comment', commentSchame);