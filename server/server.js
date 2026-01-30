const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const matchRoutes = require('./routes/matchRoutes');
require('dotenv').config(); // מאפשר לקרוא משתנים מקובץ .env

// יצירת האפליקציה
const app = express();

// --- Middlewares (הגדרות ביניים) ---
app.use(express.json()); // חובה: כדי שהשרת יבין JSON שנשלח מהריאקט
app.use(cors()); // חובה: מאפשר לריאקט לדבר עם השרת
app.use('/api/matches', matchRoutes);

// --- ייבוא הנתיבים (Routes) ---
const authRoutes = require('./routes/authRoutes');
const candidateRoutes = require('./routes/candidateRoutes'); // <-- הוספנו את זה!

// --- חיבור הנתיבים לכתובות ---
app.use('/api/auth', authRoutes);
app.use('/api/profile', candidateRoutes); // <-- הוספנו את זה! (כל מה שקשור לפרופיל יתחיל ב /api/profile)

// בדיקת שרת פשוטה - כדי לראות שהכל עובד בדפדפן
app.get('/', (req, res) => {
  res.send('Shidduchim Server is Running! 🚀');
});

// הגדרת הפורט
const PORT = process.env.PORT || 5000;

// חיבור לדאטה בייס והפעלת השרת
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shidduchimDB';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });