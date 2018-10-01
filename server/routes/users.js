var express = require('express');
var router = express.Router();
let HttpCodes = require('http-status-codes');

// /users/...

router.get('/', (req, res) => {
  // TODO: implement this route
  res.sendStatus(HttpCodes.NOT_IMPLEMENTED);
});

/* POST a login (attempt) */
router.post('/login', (req, res) => {
  // TODO: fill with actual logic
  res.sendStatus(HttpCodes.NOT_IMPLEMENTED);
});

router.post('/register', (req, res) => {
  // TODO: implement this route
  res.sendStatus(HttpCodes.NOT_IMPLEMENTED);
});

router.get('/:username', (req, res) => {
  // TODO: implement this route
  res.sendStatus(HttpCodes.NOT_IMPLEMENTED);
});

router.post(':username/isActive', (req, res) => {
  // TODO: implement this route
  res.sendStatus(HttpCodes.NOT_IMPLEMENTED);
});

router.post(':username/isAdmin', (req, res) => {
  // TODO: implement this route
  res.sendStatus(HttpCodes.NOT_IMPLEMENTED);
});

module.exports = router;
