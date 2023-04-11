const Post = require('../models/Post');
const Comment = require('../models/Comment');
const asyncHandler = require('express-async-handler');
const { NotFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');


exports.createPost = asyncHandler(async (req, res) => {
  req.body.image = req.image;
  req.body.user = req.user.userId;
  const post = await Post.create(req.body);
  res.status(StatusCodes.CREATED).json({ data: post });
});

exports.updateController = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length > 0) {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPost)
      throw new NotFoundError(`No post for this id: ${req.params.id}`);
    res.status(StatusCodes.OK).json({ message: "Success", updatedPost})
  } else {
    res.status(StatusCodes.OK).json({ message: "No Updated" });
  }
})

exports.getMyPosts = asyncHandler(async (req, res) => {
  const myPosts = await Post.find({ user: req.user.userId });
  if (myPosts.length === 0)
    throw new NotFoundError('Not have posts')
  res.status(StatusCodes.OK).json({ data: myPosts });
})

exports.getAllPosts = asyncHandler(async (req, res) => {
  const page = req.query.page || 1
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const posts = await Post.find({}).limit(limit).skip(skip);
  if (posts.length === 0)
    throw new NotFoundError('No posts')
  res.status(StatusCodes.OK).json({data:posts})
});

exports.addLike = asyncHandler(async (req, res) => {
  const obj = { user: req.user.userId, name: req.user.userName };
  const addLikeToPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      // The $addToSet
      // operator adds a value to an array unless the value is already present, in which case 
      // $addToSet
      // does nothing to that array
      $addToSet: { likes: obj },
    },
    {
      new: true,
    }
  );
  if (!addLikeToPost)
    throw new NotFoundError(`No post for this id: ${req.params.id}`);
  res.status(StatusCodes.OK).json({ countOfLikes: addLikeToPost.likes.length, likes: addLikeToPost.likes });
});

exports.removeLike = asyncHandler(async (req, res) => {
  const removeLikePost = await Post.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user.userId,
    },
    {
      $pull: { likes: { user: req.user.userId } },
    },
    {
      new: true,
    }
  )
  if (!removeLikePost)
    throw new NotFoundError(`No post for this id: ${req.params.id} or no make this like`);
  
  res.status(StatusCodes.OK)
    .json({
      message: "Removed Success",
      countOfLikes: removeLikePost.likes.length,
      likes: removeLikePost.likes,
    })
});


exports.addComment = asyncHandler(async (req, res) => {
  const obj = { post: req.params.id, user: req.user.userId, name: req.user.userName, text: req.body.text };
  const addCommentToPost = await Comment.create(obj)
  
  res.status(StatusCodes.OK)
    .json({
      message: "Add comment success",
      comment: addCommentToPost
    })
})

exports.updateComment = asyncHandler(async (req, res) => {
  // Get comment based on text
  const updateComment = await Comment.findOneAndUpdate(
    {
      post: req.params.id,
      user:req.user.userId,
    },
    {
      text: req.body.text
    },
    {
      new: true,
    }
  ).select('-_id -__v');

  res.status(StatusCodes.OK)
    .json({ message: "Updated Succecc", updateComment });
});

exports.removeComment = asyncHandler(async (req, res) => {
  await Comment.findOneAndRemove({
    _id: req.params.id,
    user: req.user.userId,
  });
  res.status(StatusCodes.NO_CONTENT).send();
})


exports.getAllLikesForThisPost = asyncHandler(async (req, res) => {
  const AllLikesForThisPost = await Post.findById(req.params.id);
  res.status(StatusCodes.OK).json({
    message: "Success",
    countOfLikes: AllLikesForThisPost.likes.length,
    likes: AllLikesForThisPost.likes
  })
});

exports.getAllCommentsForThisPost = asyncHandler(async (req, res) => {
  const AllCommentsForThisPost = await Comment.find({ post: req.params.id }).select("name text ");
  res.status(StatusCodes.OK).json({
    message: "Success",
    countOfComments: AllCommentsForThisPost.length,
    comments: AllCommentsForThisPost
  })
});