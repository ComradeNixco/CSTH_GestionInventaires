var createError = require('http-errors');
var express = require('express');
require('dotenv-safe').config({ allowEmptyValues: true });
//var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Mongoose config
let mongoose = require('mongoose');

let mngConnectionStr = 'mongodb://';
if (process.env.MONGO_USERNAME != '') {
  mngConnectionStr += process.env.MONGO_USERNAME;
  mngConnectionStr += `:${process.env.MONGO_PASSWD}@`;
}
mngConnectionStr += process.env.MONGO_HOST;
if (process.env.MONGO_PORT != '') mngConnectionStr += `:${process.env.MONGO_PORT}`;
mngConnectionStr += `/${process.env.MONGO_DB_NAME}`;
mongoose.connect(mngConnectionStr, { promiseLibrary: require('bluebird') })
  .then(() => console.debug('MongoDB connection successful'))
  .catch(err => console.error(err))
;

mongoose.connection.on('disconnected', () => console.debug('MongoDB connection closed'));

// App config
app.use(logger('dev'));
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
