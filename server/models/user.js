/* eslint-disable indent */
let mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken');
/* eslint-enable indent */

// bcrypt's salting rounds number, if not set or 0, set it to a default 11 (~5  hashes/sec on a 2GHz core)
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 11;

let UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwd: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false }
});

/**
 * Hashes the password as needed before saving the new document
 *
 * @param next Callback to the next middleware
 */
UserSchema.pre('save', function hashPassword(next) {

  // only hash password if it has been modified or is new
  if (!this.isModified('passwd')) return next();

  // generate salt and hash the password along with it
  bcrypt.hash(this.passwd, SALT_ROUNDS, (err, hash) => {
    if (err) return next(err);

    this.passwd = hash;
    return next();
  });
});

/**
 * Compares the plain-text passsword against the saved hash of the user document
 * @param {string} plainText The plain-text passwd to test against the saved hash
 * @param {(err: Error, same: boolean) => void} cb The callback to call with the result of the comparison
 */
UserSchema.methods.comparePassword = function(plainText, cb) {
  bcrypt.compare(plainText, this.passwd, cb);
};

UserSchema.methods.generateJwt = function() {
  return jwt.sign({
    _id: this._id,
    username: this.username,
    isAdmin: this.isAdmin,
    isActive: this.isActive,
    iat: Math.floor(Date.now() / 1000 ),
  }, process.env.JWT_SECRET, {expiresIn: 2 * 60 * 60});
};

module.exports = mongoose.model('User', UserSchema);



