const mongoose = require('mongoose');

const likeSchame = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, , "Like must belongs to user"]
  },
  name: {
    type: String,
    required: [true, "your name for like"],
  }
}, { _id: false });


const postSchame = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, 'Post must belongs to user']
  },
  text: {
    type: String,
    required: [true, 'Text  requied']
  },
  image: String,
  likes: [likeSchame],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchame);