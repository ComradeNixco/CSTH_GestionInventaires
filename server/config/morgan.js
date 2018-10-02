const fs = require('fs');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const debug = require('debug')('app:config:morgan');

/**
 * Setups morgan for the Express app logging
 * @param {Express} app The Express app to configure morgan to
 * @param {string} logDirectory directory for the logs
 */
module.exports = function setupLogging(app, logDirectory) {

  // if not existing, create the logs folder
  debug('Creating log directy if not existing');
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
  debug('done');

  let logStrm = rfs('access.log', {
    compress: 'gzip',
    size: '512M',
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
    skip: (req, res) => res.statusCode < 400 || (process.env.NODE_ENV && process.env.NODE_ENV === 'test')
  }));
  app.use(morgan('combined', {
    stream: logStrm
  }));

  debug('morgan configured');
};