let userController = require('../controllers/users');
let express = require('express');
let router = express.Router();
const passport = require('passport');
const userAccessMiddlewares = require('../middlewares/userAccess');

// /users/...
let isAdminMiddlewares = [
  userAccessMiddlewares.hasToken,
  userAccessMiddlewares.isActive,
  userAccessMiddlewares.isAdmin,
];

router.get('/',
  ...isAdminMiddlewares,
  userController.getUsers
);

router.post('/login',
  passport.authenticate('local', { session: false }),
  userController.login
);
router.post('/register', userController.register);

router.post('/:username/isActive',
  ...isAdminMiddlewares,
  userController.toggleIsActive
);
router.post('/:username/isAdmin',
  ...isAdminMiddlewares,
  userController.toggleIsAdmin
);

module.exports = router;
