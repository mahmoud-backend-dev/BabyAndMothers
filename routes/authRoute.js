const passport = require('passport');
const express = require('express');
const router = express.Router();
const {
  signup,
  varifyResetCodeForSignup,
  login,
  varifyResetCodeForPassword,
  forgetPassword,
  resetPassword,
  resendRestCodeForSignup,
  resendRestCodeForPassword
} = require('../controller/authController')
const {
  signupValidator,
  varifyCodeValidator,
  loginValidator,
  forgetPasswordValidator,
  resetPasswordValidator
} = require('../utils/validators/authValidator')

router.get('/google',
    passport.authenticate('google', { scope:
      ['email', 'profile'],
    }
  ));

  router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.json({ user: req.user, token: req.token });
    });
  
router.post('/signup', signupValidator, signup);
router.post('/signup/resendResetCode', forgetPasswordValidator, resendRestCodeForSignup);

router.post('/login', loginValidator ,login);

router.post('/varifyResetCodeForSignup', varifyCodeValidator, varifyResetCodeForSignup);

router.post('/forgetPassword', forgetPasswordValidator, forgetPassword);
router.post('/forgetPassword/resendResetCode',forgetPasswordValidator, resendRestCodeForPassword);
router.post('/varifyResetCodeForPassword', varifyCodeValidator, varifyResetCodeForPassword);
router.post('/resetPassword',resetPasswordValidator,resetPassword)


module.exports = router;