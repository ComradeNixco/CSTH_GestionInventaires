const userController = require('../controllers/users');
let express = require('express');
let router = express.Router();
const passport = require('passport');

// /users/...

router.get('/', userController.getUsers);
router.get('/:username', userController.getUser);

router.post('/login', 
  passport.authenticate('local', { session: false }),
  userController.login
);
router.post('/register', userController.register);
router.post(':username/isActive', userController.setIsActive);
router.post(':username/isAdmin', userController.setIsAdmin);

module.exports = router;
