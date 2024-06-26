const validatorMiddleWare = require('../../middleware/validatorMiddleware');
const { body } = require('express-validator');
const { BadRequest } = require('../../errors');
const User = require('../../models/User');

exports.signupValidator = [
  body('email').notEmpty().withMessage('E-mail is requied')
    .isEmail().withMessage('E-mail must be valid format'),
  body('password').notEmpty().withMessage('Password is requied')
    .isLength({ min: 6 }).withMessage('Too short password'),
    body('confirmPassword').notEmpty().withMessage('Confirm password is requied')
      .custom((val, { req }) => {
        if (val !== req.body.password)
          throw new BadRequest('Password confirmation incorrect')
        return true
    }),  
  body('firstName').notEmpty().withMessage('First Name is requied'),
  body('lastName').notEmpty().withMessage('Last Name is requied'),
  validatorMiddleWare,
]

exports.varifyCodeValidator = [
  body('resetCode').notEmpty().withMessage('Reset code is required'),
  body('email').notEmpty().withMessage('E-mail is requied').
    isEmail().withMessage('E-mail must be valid format'), 
  validatorMiddleWare,
]

exports.loginValidator = [
  body('email').notEmpty().withMessage('E-mail is requied'),
  body('password').notEmpty().withMessage('Password is requied'),
validatorMiddleWare,
]

exports.forgetPasswordValidator = [
  body('email').notEmpty().withMessage('E-mail is requied'),
  validatorMiddleWare,
]

exports.resetPasswordValidator = [
  body('email').notEmpty().withMessage('E-mail is requied'),
  body('newPassword').notEmpty().withMessage('Password is requied'),
  validatorMiddleWare,
]


