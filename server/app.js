require('dotenv-safe').config({ allowEmptyValues: true });
var cookieParser = require('cookie-parser');
var express = require('express');
let fs = require('fs');
var createError = require('http-errors');
var logger = require('morgan');
var path = require('path');
let rfs = require('rotating-file-stream');
let debug = require('debug')('app:startup');

debug('starting server...');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Mongoose config
require('./config/mongoose');

// Configuration du logger (Morgan)
let logDirectory = path.join(__dirname, 'logs');
// if not existing, create the logs folder
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

let logStrm = rfs('access.log', {
  compress: 'gzip',
  size: '300B',
  interval: '1d',
  path: logDirectory
});

/**
 * When a log file is rotated, add the gz extension as they get compressed to that format
 * @param {string} filename the filename of the newly archived log file
 */
logStrm.on('rotated', function(filename) {
  // rotation job completed with success producing given `filename`
  fs.renameSync(filename, `${filename}.gz`);
});

app.use(logger('dev', {
  skip: (req, res) => res.statusCode < 400
}));
app.use(logger('common', {
  stream: logStrm
}));


// App config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
