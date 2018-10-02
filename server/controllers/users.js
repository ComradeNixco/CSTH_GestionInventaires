const errorCodes = require('http-status-codes');
const User = require('../models/user');

exports.getUser = (req, res) => {
  res.sendStatus(errorCodes.NOT_IMPLEMENTED);
};

exports.getUsers = (req, res) => {
  res.sendStatus(errorCodes.NOT_IMPLEMENTED);
};

exports.login = (req, res) => {
  res.sendStatus(errorCodes.NOT_IMPLEMENTED);
};

/**
 * Registers a new user
 * @param {Request} req Request object, body should have email and passwd setted
 * @param {Response} res Response object
 */
exports.register = (req, res) => {
  if (req.body.username == null || req.body.passwd == null) {
    res.sendStatus(errorCodes.BAD_REQUEST);
    return;
  }

  new User({
    username: req.body.username,
    passwd: req.body.passwd
    // isActive has to ber manually setted by an admin
  }).save(err => {
    if (err && err.code && err.code === 11000) {
      res
        .status(errorCodes.CONFLICT)
        .json({
          message: 'Username already used'
        });
      return;
    }

    // TODO Finish implementation and then remove next line
    res.sendStatus(errorCodes.CREATED);
  });
};


exports.setIsActive = (req, res) => {
  res.sendStatus(errorCodes.NOT_IMPLEMENTED);
};

exports.setIsAdmin = (req, res) => {
  res.sendStatus(errorCodes.NOT_IMPLEMENTED);
};