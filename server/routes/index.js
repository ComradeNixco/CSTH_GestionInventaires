let express = require('express');
let HttpCodes = require('http-status-codes');
let router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  return res.status(HttpCodes.OK).json({'hello': 'world!'});
});

module.exports = router;
