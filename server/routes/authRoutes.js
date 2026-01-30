const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { register, login, getPendingUsers, approveUser } = require('../controllers/authController');

// הרשמה והתחברות (פתוח לכולם)
router.post('/register', register);
router.post('/login', login);

// פעולות מנהל (מוגנות ע"י auth)
router.get('/pending', auth, getPendingUsers);
router.put('/approve/:id', auth, approveUser);

module.exports = router;