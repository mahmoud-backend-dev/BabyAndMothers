const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'E-mail is required'],
    unique:true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Too short password'],
  },
  firstName: {
    type: String,
    required: [true, 'First namr is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last namr is required'],
  },
  role: {
    type: String,
    default: "user",
    enum: ['user', 'manager', 'admin']
  },
  hashedResetCodeForSignup: String,
  resetCodeExpiredForSignup:Date,
  resetVerifyForSignup: Boolean,
  hashedResetCodeForPassword: String,
  resetCodeExpiredForPassword:Date,
  resetVerifyForPassword: Boolean,
  image: String,
});

userSchema.methods.createJWT = function () {
  return jwt.sign({
    userId: this._id,
    userName:`${this.firstName} ${this.lastName}`,
  },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRED
    }
  );
};

userSchema.methods.comparePassword = async function (checkPassword) {
  return await bcrypt.compare(checkPassword,this.password)
}

userSchema.methods.hashedPassword = async function () {
  this.password = await bcrypt.hash(this.password, 12);
  this.save()
}




module.exports = mongoose.model('User', userSchema);