const express = require('express');

const router = express.Router();
const {
  uploadSingleImage,
} = require('../middleware/uploadImageMiddleWare')
const authMiddleWare = require('../middleware/authMiddleware')
const {
  createPost,
  getAllPosts,
  updateController,
  getMyPosts,
  addLike,
  removeLike,
  addComment,
  updateComment,
  removeComment,
  getAllLikesForThisPost,
  getAllCommentsForThisPost
} = require('../controller/postController');

const {
  createValidator,
  updateValidator,
  likeValidator,
  addCommentValidator,
  updateCommentValidator,
  removeCommentValidator,
} = require('../utils/validators/postValidator')

router
  .route('/')
  .post(authMiddleWare, uploadSingleImage('image', 'posts'), createValidator, createPost)
  .get(getAllPosts);

router.route('/:id')
  .patch(authMiddleWare, uploadSingleImage('image', 'posts'), updateValidator, updateController)
  
router.get('/me', authMiddleWare, getMyPosts);


router.route('/:id/like')
  .get(getAllLikesForThisPost)
  .post(authMiddleWare, likeValidator, addLike)
  .delete(authMiddleWare, likeValidator, removeLike);

router.route('/:id/comment')
  .get(getAllCommentsForThisPost)
  .post(authMiddleWare, addCommentValidator, addComment)
  .patch(authMiddleWare, updateCommentValidator, updateComment);

router.delete('/:idPost/comment/:id', authMiddleWare, removeCommentValidator, removeComment);

module.exports = router;