const crypto = require('crypto');
const { StatusCodes } = require('http-status-codes');
const { CustomErrorAPI, BadRequest, NotFoundError } = require('../errors');
const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const { santizeData } = require('../utils/santizeData');

const hashedResetCodeByCrypto = (resetCode) => crypto.createHash('sha256').update(resetCode).digest('hex');


//  allwoed to (user permission)
exports.allowTo = (...roles) => (asyncHandler(async (req, res, next) => {
  // Access roles
  // Access Register user (req.user)
  if (!roles.includes(req.user.role))
    throw new UnauthenticatedError("You are not allowed to access this route");
  next()
}))


// @desc Signup
// @route POST api/v1/auth/signup
// @protect Public
exports.signup = asyncHandler(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  if (user && !user.resetVerifyForSignup) {
        // Generate reset code 
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        // hash reset code than store in db
        const hashedResetCode = hashedResetCodeByCrypto(resetCode);
        user.hashedResetCodeForSignup = hashedResetCode;
        user.resetCodeExpiredForSignup = Date.now() + 10 * 60 * 1000;
        user.resetVerifyForSignup = false;
        // Send reset code to email for varification
        const mailOpts = {
          from: `Mahmod Hamdi <mh15721812@gmail.com>`,
          to: user.email,
          subject: `Your reset code for register our app (valid for 10 min)`,
          text: `Hi ${user.firstName}
        G-${resetCode}  is your varification code for register our app ( Babies And Mothers Application)`
        };
        try {
          await sendEmail(mailOpts);
        } catch (error) {
          user.hashedResetCodeForSignup = undefined;
          user.resetCodeExpiredForSignup = undefined;
          user.resetVerifyForSignup = undefined;
          await user.updateOne(req.body);
          await user.save();
          throw new CustomErrorAPI('There is an error in sending email', StatusCodes.INTERNAL_SERVER_ERROR);
        }
        await user.updateOne(req.body);
        await user.save();
  } else if(!user) {
    user = new User(req.body);
    // Generate reset code 
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    // hash reset code than store in db
    const hashedResetCode = hashedResetCodeByCrypto(resetCode);
    user.hashedResetCodeForSignup = hashedResetCode;
    user.resetCodeExpiredForSignup = Date.now() + 10 * 60 * 1000;
    user.resetVerifyForSignup = false;
    // Send reset code to email for varification
    const mailOpts = {
      from: `Mahmod Hamdi <mh15721812@gmail.com>`,
      to: user.email,
      subject: `Your reset code for register our app (valid for 10 min)`,
      text: `Hi ${user.firstName}
    G-${resetCode}  is your varification code for register our app ( Babies And Mothers Application)`
    };
    try {
      await sendEmail(mailOpts);
    } catch (error) {
      user.hashedResetCodeForSignup = undefined;
      user.resetCodeExpiredForSignup = undefined;
      user.resetVerifyForSignup = undefined;
      await user.save();
      throw new CustomErrorAPI('There is an error in sending email', StatusCodes.INTERNAL_SERVER_ERROR);
    }
    await user.save();
  } else {
    throw new BadRequest('Email is used choose anther email')
  }
  res.status(StatusCodes.OK).json({ status: 'Success', message: 'Reset code sent to email' });
});

exports.varifyResetCodeForSignup = asyncHandler(async (req, res, next) => {
  const hashedResetCode = hashedResetCodeByCrypto(req.body.resetCode);
  const user = await User.findOne({
    email: req.body.email,
    hashedResetCodeForSignup: hashedResetCode,
    resetCodeExpiredForSignup: { $gt: Date.now() },
  })
  if (!user)
    throw new BadRequest(`Reset code invalid or expired or no email for this: ${req.body.email} `)
  
  user.hashedResetCodeForSignup = undefined;
  user.resetCodeExpiredForSignup = undefined;
  user.resetVerifyForSignup = true;
  await user.save();
  await user.hashedPassword();
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ message: "Success", token, data: santizeData(user) });
});

exports.resendRestCodeForSignup = asyncHandler(async (req, res) => {
  // Get User by email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    throw new NotFoundError(`There is no user with that email ${req.body.email}`);
  
  // Generate reset code (6-digit)
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = hashedResetCodeByCrypto(resetCode);
  user.hashedResetCodeForSignup = hashedResetCode;
  user.resetCodeExpiredForSignup = Date.now() + 10 * 60 * 1000;
  user.resetVerifyForSignup = false;
  await user.save();
  const mailOpts = {
    from: `Mahmod Hamdi <mh15721812@gmail.com>`,
    to: user.email,
    subject: `Your reset code for register our app (valid for 10 min)`,
    text: `Hi ${user.firstName}
    G-${resetCode}  is your varification code for register our app ( Babies And Mothers Application)`
  };
  try {
    await sendEmail(mailOpts);
  } catch (error) {
    user.hashedResetCodeForSignup = undefined;
    user.resetCodeExpiredForSignup = undefined;
    user.resetVerifyForSignup = true;
    await user.save();
    throw new CustomErrorAPI('There is an error in sending email', StatusCodes.INTERNAL_SERVER_ERROR);
  };
  res.status(StatusCodes.OK).json({ status: 'Success', message: 'Reset code sent to email' })
});


exports.resendRestCodeForPassword = asyncHandler(async (req, res) => {
  // Get User by email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    throw new NotFoundError(`There is no user with that email ${req.body.email}`);
  
  // Generate reset code (6-digit)
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = hashedResetCodeByCrypto(resetCode);
  user.hashedResetCodeForPassword = hashedResetCode;
  user.resetCodeExpiredForPassword = Date.now() + 10 * 60 * 1000;
  user.resetVerifyForPassword = false;
  await user.save();
  const mailOpts = {
    from: `Mahmoud Hamdi <mh15721812@gmail.co>`,
    to: user.email,
    subject: 'Reset code for forget password to change your password',
    text: `Hi ${user.firstName}
    G-${resetCode}  is your varification code for change your Password ( Babies And Mothers Application)`
  };
  try {
    await sendEmail(mailOpts);
  } catch (error) {
    user.hashedResetCodeForPassword = undefined;
    user.resetCodeExpiredForPassword = undefined;
    user.resetVerifyForPassword = undefined;
    await user.save();
    throw new CustomErrorAPI('There is an error in sending email', StatusCodes.INTERNAL_SERVER_ERROR);
  };
  res.status(StatusCodes.OK).json({ status: 'Success', message: 'Reset code sent to email' })
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user.hashedResetCodeForSignup)
    throw new BadRequest('Verifiy reset code before login')
  if (!user)
    throw new NotFoundError(`No user such as this email: ${req.body.email}`);
  const isMatch = await user.comparePassword(req.body.password);
  if (!user || !isMatch)
    throw new BadRequest('E-mail or Password incorrect');
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ data: santizeData(user), token });
});


exports.forgetPassword = asyncHandler(async (req, res) => {
  // Get User by email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    throw new NotFoundError(`There is no user with that email ${req.body.email}`);
  
  // Generate reset code (6-digit)
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = hashedResetCodeByCrypto(resetCode);
  user.hashedResetCodeForPassword = hashedResetCode;
  user.resetCodeExpiredForPassword = Date.now() + 10 * 60 * 1000;
  user.resetVerifyForPassword = false;
  await user.save();
  const mailOpts = {
    from: `Mahmoud Hamdi <mh15721812@gmail.co>`,
    to: user.email,
    subject: 'Reset code for forget password to change your password',
    text: `Hi ${user.firstName}
    G-${resetCode}  is your varification code for change your Password ( Babies And Mothers Application)`
  };
  try {
    await sendEmail(mailOpts);
  } catch (error) {
    user.hashedResetCodeForPassword = undefined;
    user.resetCodeExpiredForPassword = undefined;
    user.resetVerifyForPassword = undefined;
    await user.save();
    throw new CustomErrorAPI('There is an error in sending email', StatusCodes.INTERNAL_SERVER_ERROR);
  };
  res.status(StatusCodes.OK).json({ status: 'Success', message: 'Reset code sent to email' })
});


exports.varifyResetCodeForPassword = asyncHandler(async (req, res) => {
  const hashedResetCode = hashedResetCodeByCrypto(req.body.resetCode);
  // Get user based on reset code
  const user = await User.findOne({
    email: req.body.email,
    hashedResetCodeForPassword: hashedResetCode,
    resetCodeExpiredForPassword: { $gt: Date.now() }
  });

  if (!user)
    throw new BadRequest(`Reset code invalid or expired or no email for this: ${req.body.email} `)
  user.resetVerifyForPassword = true;
  await user.save();
  res.status(StatusCodes.OK).json({ status: "Success" });
});


exports.resetPassword = asyncHandler(async (req, res) => {
  // Get user based on email
  const user = await User.findOne({ email: req.body.email })
  if (!user)
    throw new NotFoundError(`There is no user with that email ${req.body.email}`)
  if (!user.resetVerifyForPassword)
    throw new BadRequest('Reset code not verified');
  
  user.password = req.body.newPassword;
  user.hashedResetCodeForPassword = null;
  user.resetCodeExpiredForPassword = null;
  user.resetVerifyForPassword = undefined;
  await user.save();
  await user.hashedPassword();
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ token, data: santizeData(user) });
})