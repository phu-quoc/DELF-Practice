const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A role must have a valid name'],
    unique: true,
  },
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
