/* eslint-disable indent */
let passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');
/* eslint-enable indent */

passport.use(new LocalStrategy({
  usernameField: 'email'
}, (username, passwd, done) => {
  User.findOne({ email: username }, (err, user) => {
    if (err) return done(err);

    if (!user) return done(null, false, { message: 'User not found' });

    user.comparePassword(passwd, (err, isValid) => {
      if (err) return done(err);

      if (isValid)
        return done(null, user);
      else
        return done(null, false, { message: 'Password is wrong' });
    });
  });
}));