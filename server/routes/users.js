const userController = require('../controllers/users');
let express = require('express');
let router = express.Router();

// /users/...

router.get('/', userController.getUsers);
router.get('/:username', userController.getUser);

router.post('/login', userController.login);
router.post('/register', userController.register);
router.post(':username/isActive', userController.setIsActive);
router.post(':username/isAdmin', userController.setIsAdmin);

module.exports = router;
