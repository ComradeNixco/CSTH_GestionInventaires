const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
const debug = require('debug')('app:config:morgan');

module.exports = function setupLogging(app) {
  let logDirectory = path.join(__dirname, 'logs');
  // if not existing, create the logs folder
  debug('Creating log directy if not existing');
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
  debug('done');

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
    require('debug')('app:log:rotation')(`old log has been rotated and renamed: ${filename}.gz`);
  });

  app.use(morgan('dev', {
    skip: (req, res) => res.statusCode < 400
  }));
  app.use(morgan('common', {
    stream: logStrm
  }));

  debug('morgan configured');
};