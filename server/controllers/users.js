const httpCodes = require('http-status-codes');
const User = require('../models/user');

exports.getUserInfo = (req, res) => {
  /* eslint-disable indent */
  const userName = req.params.username,
        property = req.params.property;
  /* eslint_enable indent */
  if (!userName || !property) {
    res.status(httpCodes.BAD_REQUEST).json({
      msg: 'wrong route parameter values',
      username: userName,
      property: property
    });
    return;
  }

  if (![ 'isActive', 'isAdmin' ].includes(property)) {
    res.status(httpCodes.BAD_REQUEST).json({
      msg: 'Property value must be either "isAdmin" or "isActive"',
      property: property
    });
    return;
  }

  User.findOne({username: userName}, (err, user) => {
    if (err) {
      res.status(httpCodes.INTERNAL_SERVER_ERROR).json(err);
      return;
    }

    if (user)
      res.json(user[property]);
    else
      res.sendStatus(httpCodes.NOT_FOUND);
  });
};

/**
 * Gets an up-to-date lists of all the users
 */
exports.getUsers = (req, res) => {
  User.find({}, (err, users) => {
    if (err) {
      res
        .status(httpCodes.INTERNAL_SERVER_ERROR)
        .json({error: err});
      return;
    }

    res.status(httpCodes.OK).json(users);
  });
};

/**
 * Logins a user, issuing it a JWT token if login succeeded
 * @param {Request} req Request object, should have the user property from passport
 * @param {Response} res Response object
 */
exports.login = (req, res) => {
  if (!req.user) {
    res
      .status(httpCodes.INTERNAL_SERVER_ERROR)
      .json({error: 'req.user not set in login controller'});
    return;
  }

  res
    .status(httpCodes.OK)
    .json({
      token: req.user.generateJwt()
    });
};

/**
 * Registers a new user
 * @param {Request} req Request object, body should have email and passwd setted
 * @param {Response} res Response object
 */
exports.register = (req, res) => {
  if (req.body.username == null || req.body.passwd == null) {
    res.sendStatus(httpCodes.BAD_REQUEST);
    return;
  }

  new User({
    username: req.body.username,
    passwd: req.body.passwd
    // isActive has to be manually setted by an admin
  }).save(err => {
    if (err && err.code && err.code === 11000) {
      res
        .status(httpCodes.CONFLICT)
        .json({
          message: 'Username already used'
        });
      return;
    }

    res.sendStatus(httpCodes.CREATED);
  });
};


exports.toggleIsActive = (req, res) => {
  if (!req.params.username) {
    res.sendStatus(httpCodes.INTERNAL_SERVER_ERROR);
    return;
  }

  User.findOne({username: req.params.username}, (err, user) => {
    if (err) {
      res.status(httpCodes.INTERNAL_SERVER_ERROR).json(err);
      return;
    }

    if (user === null) {
      res.sendStatus(httpCodes.NOT_FOUND);
      return;
    }

    User.countDocuments({isAdmin: true}, (err, adminCount) => {
      if (err) {
        res.status(httpCodes.INTERNAL_SERVER_ERROR).json(err);
        return;
      }

      if (adminCount === 1 && user.isAdmin) {
        res
          .status(httpCodes.CONFLICT)
          .json({
            state: user.isActive,
            conflictReason: 'This user is the last admin, it cannot be deactivated'
          });
        return;
      }

      user.isActive = !user.isActive;
      user.save();
      res.json({
        newState: user.isActive
      });
    });
  });
};

exports.toggleIsAdmin = (req, res) => {
  if (!req.params.username) {
    res.sendStatus(httpCodes.INTERNAL_SERVER_ERROR);
    return;
  }

  User.findOne({username: req.params.username}, (err, user) => {
    if (err) {
      res.status(httpCodes.INTERNAL_SERVER_ERROR).json(err);
      return;
    }

    if (user === null) {
      res.sendStatus(httpCodes.NOT_FOUND);
      return;
    }

    User.countDocuments({isAdmin: true}, (err, count) => {
      if (err) {
        res.status(httpCodes.INTERNAL_SERVER_ERROR).json(err);
        return;
      }

      if (count === 1 && user.isAdmin) {
        res.status(httpCodes.CONFLICT).json({
          state: user.isAdmin,
          conflictReason: 'This user is the last admin, it cannot be stripped of it\'s rights'
        });
        return;
      }

      user.isAdmin = !user.isAdmin;
      user.save();
      res.json({
        newState: user.isAdmin
      });
    });
  });
};