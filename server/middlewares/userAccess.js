const httpCodes = require('http-status-codes');
/**
 * Checks that the incoming request has a valid JWT token
 */
let jwt = require('express-jwt');
module.exports.hasToken = jwt({
  secret: process.env.JWT_SECRET,
  /*getToken: req => {
    return req.get('Authorization').split('Bearer ')[1];
  }*/
});

/**
 * Check if req.user is set and if it represents an active user
 * @param {Request} req The Express Request object
 * @param {Response} res The Express Response Object
 * @param {RequestHandler} next The next handler for the actual (activated) route
 */
module.exports.isActive = (req, res, next) => {
  if (req.user && req.user.isActive)
    next();
  else
    res.sendStatus(httpCodes.FORBIDDEN);
};

/**
 * Check if req.user is set and it represents an admin user
 * @param {Request} req The Express Request object
 * @param {Response} res The Express Response Object
 * @param {RequestHandler} next The next handler for the actual (activated) route
 */
module.exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin)
    next();
  else
    res.sendStatus(httpCodes.FORBIDDEN);
};