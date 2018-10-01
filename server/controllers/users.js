const errorCodes = require('http-status-codes');
////const User = require('../models/user');

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
  if (req.body.email == null || req.body.passwd == null)
    res.sendStatus(errorCodes.BAD_REQUEST);

  res.sendStatus(errorCodes.NOT_IMPLEMENTED);
};


exports.setIsActive = (req, res) => {
  res.sendStatus(errorCodes.NOT_IMPLEMENTED);
};

exports.setIsAdmin = (req, res) => {
  res.sendStatus(errorCodes.NOT_IMPLEMENTED);
};