const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

// ייבוא כל הפונקציות (כולל המחיקה החדשה)
const { 
  createMatch, 
  getMyMatches, 
  updateMatchStatus, 
  deleteMatch 
} = require('../controllers/matchController');

// 1. יצירת שידוך
router.post('/', auth, createMatch);

// 2. קבלת כל השידוכים
router.get('/', auth, getMyMatches);

// 3. עדכון סטטוס
router.put('/:id', auth, updateMatchStatus);

// 4. מחיקת שידוך
router.delete('/:id', auth, deleteMatch);

module.exports = router;