const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const googleAccountSchema = new mongoose.Schema({
  googleId: String,
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true
  },
  image: String,
});

googleAccountSchema.methods.createJWT = function () {
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

module.exports = mongoose.model('Google-Account', googleAccountSchema);