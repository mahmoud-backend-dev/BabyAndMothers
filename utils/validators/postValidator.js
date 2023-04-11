const validatorMiddleWare = require("../../middleware/validatorMiddleware");

const { body, param } = require('express-validator');
const Post = require("../../models/Post");
const { NotFoundError, BadRequest } = require("../../errors");
const {
  uploadImageToCloudinary,
} = require('../../middleware/uploadImageMiddleWare');
const Comment = require("../../models/Comment");

exports.createValidator = [
  body('text').notEmpty().withMessage('Tesx field  required'),
  body('image')
    .custom(async (val, { req }) => {
      if (req.file) {
        req.image = await uploadImageToCloudinary(req.file.path);
      }
      return true
    }),
  validatorMiddleWare,
];


exports.updateValidator = [
  body('image')
  .custom(async (val, { req }) => {
    if (req.file) {
      req.image = await uploadImageToCloudinary(req.file.path);
    }
    return true
  }),
  validatorMiddleWare,
]

exports.likeValidator = [
  param('id').notEmpty().withMessage('Id for this post required')
    .isMongoId().withMessage('Invalid id format as MongoId (ObjectId) ')
    .custom(async (val) => {
      const post = await Post.findById(val)
      if (!post)
        throw new NotFoundError(`No post for this id: ${val}`);
      return true
    }),
  validatorMiddleWare
]


exports.addCommentValidator = [
  param('id').notEmpty().withMessage('Id for this post required')
    .isMongoId().withMessage('Invalid id format as MongoId (ObjectId) ')
    .custom(async (val) => {
      const post = await Post.findById(val)
      if (!post)
        throw new NotFoundError(`No post for this id: ${val}`);
      return true
    }),
  body('text').notEmpty().withMessage('Text of comment required'),
  validatorMiddleWare,
]

exports.updateCommentValidator = [
  param('id').notEmpty().withMessage('Id for this post required')
  .isMongoId().withMessage('Invalid id format as MongoId (ObjectId) ')
    .custom(async (val, { req }) => {
      const comment = await Comment.findOne({ post: val, user: req.user.userId });
      if (!comment)
        throw new NotFoundError(`No post for this id: ${val} or you are not make this comment`);
      return true
  }),
  body('text').notEmpty().withMessage('Text of comment required'),
  validatorMiddleWare,
]

exports.removeCommentValidator = [
  param('idPost').notEmpty().withMessage('Id for this post required')
  .isMongoId().withMessage('Invalid id format as MongoId (ObjectId) '),
  param('id').notEmpty().withMessage('Id for this comment required')
    .isMongoId().withMessage('Invalid id format as MongoId (ObjectId) ')
    .custom(async (val, { req }) => {
      const comment = await Comment.findOne({ _id: val, post: req.params.isPost, user: req.user.userId });
      if (!comment)
        throw new NotFoundError(`No post for this id: ${val} or you are not make this comment`);
      return true
  }),
  validatorMiddleWare
];






