const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  role: {
    type: String,
    required: [true, 'A role must have a valid email address'],
    unique: true,
  },
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
