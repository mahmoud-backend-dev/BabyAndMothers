const crypto = require('crypto');
const { StatusCodes } = require('http-status-codes');
const { CustomErrorAPI, BadRequest } = require('../errors');
const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const {santizeData} = require('../utils/santizeData')

const hashedResetCodeByCrypto = (resetCode) => crypto.createHash('sha256').update(resetCode).digest('hex');

exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User(req.body);
  // Generate reset code 
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  // hash reset code than store in db
  const hashedResetCode = hashedResetCodeByCrypto(resetCode);
  user.hashedResetCode = hashedResetCode;
  user.resetCodeExpired = Date.now() + 10 * 60 * 1000;
  user.resetVerify = false;
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
    user.hashedResetCode = undefined;
    user.resetCodeExpired = undefined;
    user.resetVerify = undefined;
    await user.save();
    throw new CustomErrorAPI('There is an error in sending email', StatusCodes.INTERNAL_SERVER_ERROR);
  }
  await user.save();
  res.status(StatusCodes.CREATED).json({ data: santizeData(user) });
});

exports.varifyResetCode = asyncHandler(async (req, res, next) => {
  const hashedResetCode = hashedResetCodeByCrypto(req.body.resetCode);
  const user = await User.findOne({
    hashedResetCode: hashedResetCode,
    resetCodeExpired: { $gt: Date.now() }
  });

  if (!user)
    throw new BadRequest('Reset code invalid or expired')
  
  await User.updateOne(
    { email: user.email },
    {
      hashedResetCode: null,
      resetCodeExpired: null,
      resetVerify: true
    });
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ message: "Success", token, data: santizeData(user) });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  const isMatch = await user.comparePassword(req.body.password);
  if (!user || !isMatch)
    throw new BadRequest('E-mail or Password incorrect');
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ data: santizeData(user), token });
});