let mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  hash: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false }
});

/**
 * Saves the users password after hashing it (with bcrypt)
 * @param {string} passwd the password to hash and save
 */
/*userSchema.methods.setPassword = function(passwd) {

};*/

module.exports = mongoose.model('User', UserSchema);