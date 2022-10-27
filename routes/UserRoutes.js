const router = require('express').Router();
const passport = require('passport');
const {RegisterUser, VerifyToken, LoginUser, GetUser} = require('../Controller/UserController');
router.post('/register',RegisterUser);
router.post('/isAuthenticated',VerifyToken);
router.post('/login',passport.authenticate('local'),LoginUser);
router.get('/admin/users',GetUser)
module.exports = router;