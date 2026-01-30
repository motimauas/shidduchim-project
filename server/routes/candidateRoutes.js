const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

// ייבוא הפונקציות (פעם אחת בלבד!)
const { 
  createOrUpdateProfile, 
  getMyProfile, 
  getAllCandidates, 
  deleteCandidate 
} = require('../controllers/candidateController');

// הגדרת הנתיבים
router.post('/', auth, createOrUpdateProfile);
router.get('/me', auth, getMyProfile);
router.get('/all', auth, getAllCandidates);
router.delete('/:id', auth, deleteCandidate);

module.exports = router;