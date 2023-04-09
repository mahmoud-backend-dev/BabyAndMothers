const passport = require('passport');
const express = require('express');
const router = express.Router();
const {
  signup,
  varifyResetCode,
  login
} = require('../controller/authController')
const {
  signupValidator,
  varifyCodeValidator,
  loginValidator
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

router.post('/login', loginValidator ,login);

router.post('/varifyResetCode', varifyCodeValidator, varifyResetCode);


module.exports = router;