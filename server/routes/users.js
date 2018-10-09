const userController = require('../controllers/users');
let express = require('express');
let router = express.Router();
const passport = require('passport');
const userAccessMiddlewares = require('../middlewares/userAccess');

// /users/...
let isAdmin = [
  userAccessMiddlewares.hasToken,
  userAccessMiddlewares.isActive,
  userAccessMiddlewares.isAdmin,
];

router.get('/',
  ...isAdmin,
  userController.getUsers
);

router.post('/login',
  passport.authenticate('local', { session: false }),
  userController.login
);
router.post('/register', userController.register);

router.post(':username/isActive',
  ...isAdmin,
  userController.setIsActive
);
router.post(':username/isAdmin',
  ...isAdmin,
  userController.setIsAdmin
);

module.exports = router;
