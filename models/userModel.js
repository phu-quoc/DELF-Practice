const mongoose = require('mongoose');
const slugify = require('slugify');
const Role = require('../models/roleModel');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'A user must have a valid email address'],
    unique: true,
  },
  password: {
    type: String,
  },
  name: {
    type: String,
    required: [true, 'A user must have a valid name'],
  },
  avatar: {
    type: String,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  },
});

//DOCUMENT MIDDLEWARE
userSchema.pre('save', async function (next) {
  if (this.role === undefined) {
      const role = await Role.findOne({
        name: 'User',
      });
      this.role = role._id;
      next();
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
