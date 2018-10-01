let debug = require('debug')('app:config:mongoose');
let mongoose = require('mongoose');

let mngConnectionStr = 'mongodb://';
if (process.env.MONGO_USERNAME != '') {
  mngConnectionStr += process.env.MONGO_USERNAME;
  mngConnectionStr += `:${process.env.MONGO_PASSWD}@`;
}
mngConnectionStr += process.env.MONGO_HOST;
if (process.env.MONGO_PORT != '') mngConnectionStr += `:${process.env.MONGO_PORT}`;
mngConnectionStr += `/${process.env.MONGO_DB_NAME}`;

debug('Connecting to MongoDB server');
mongoose.connect(mngConnectionStr, {
  promiseLibrary: require('bluebird'),
  useNewUrlParser: true
}).then(() => debug('MongoDB connection successful'))
  .catch(err => debug('Error!:\n%O', err))
;

mongoose.connection.on('disconnected', () => debug('MongoDB connection closed'));

// Register the models
require('../models/user');