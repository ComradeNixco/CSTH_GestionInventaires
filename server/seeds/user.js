/**
 * Script de Seeding pour remplir la BD mongo pour le model User
 * @author Nicolas Lapointe <nixcocpp@gmail.com>
 */

let debug = require('debug')('seed:users');

debug('Seeding users');
const User = require('../models/user');

debug('First, delete old test entries');
User.deleteMany({
  username: {
    $in: [
      'test',
      'test-admin'
    ]
  }
}, err => {
  if (err) {
    debug('Couldn\'t delete "%s": %o', err);
    return;
  }
});

debug('The refill them correctly');
const users = [
  new User({
    username: 'test',
    passwd: 'Password01$',
    isActive: true
  }),
  new User({
    username: 'test-admin',
    passwd: 'Password01$',
    isActive: true,
    isAdmin: true
  })
];

users.forEach(u => {
  debug('"%s" done!', u.username);
  u.save().catch(err => {
    debug('Couldn\'t save %s: %s', u.username, err.message);
  });
});

/*User.create([
  {
    username: 'test',
    passwd: 'Password01$',
    isActive: true
  },
  {
    username: 'test-admin',
    passwd: 'Password01$',
    isActive: true,
    isAdmin: true
  }
], function(err, user) {
  if (err) {
    console.error('Error while seeding User: ' + err.message);
  }

  user.save();
});*/
