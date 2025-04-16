const express = require('express');
const { registerUser, loginUser,getAll } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getAll);

module.exports = router;