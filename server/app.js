require('dotenv-safe').config({ allowEmptyValues: true });
var cookieParser = require('cookie-parser');
var express = require('express');
var createError = require('http-errors');
let debug = require('debug')('app:startup');

debug('starting server...');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// configs
require('./config/mongoose');
require('./config/morgan')(app);

// Configuration du logger (Morgan)



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
