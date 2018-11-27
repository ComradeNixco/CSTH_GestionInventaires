require('dotenv-safe').config({ allowEmptyValues: true });

/* eslint-disable indent */
let cookieParser = require('cookie-parser'),
    createError = require('http-errors'),
    debug = require('debug')('app:startup'),
    express = require('express'),
    path = require('path'),
    passport = require('passport'),
    cors = require('cors');
/* eslint-enable indent */

debug('starting server...');

var app = express();

// configs
require('./config/mongoose');
if (process.env.NODE_ENV !== 'test')
  require('./config/morgan')(app, path.join(__dirname, 'logs'));
require('./config/passport');

// App config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors());

// Routers
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
if (process.env.NODE_ENV !== 'test') {
  app.use(function(err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
}

module.exports = app;
