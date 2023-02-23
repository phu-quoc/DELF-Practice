const mongoose = require('mongoose');

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
});

const User = mongoose.model('User', userSchema);

module.exports = User;
