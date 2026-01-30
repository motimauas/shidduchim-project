const CandidateProfile = require('../models/Candidate');

// יצירה או עדכון של פרופיל אישי
exports.createOrUpdateProfile = async (req, res) => {
  try {
    // מכינים את האובייקט לשמירה
    const profileFields = {
      user: req.user.id, // ה-ID הגיע מהטוקן (דרך ה-Middleware)
      ...req.body // כל שאר השדות מגיעים מהטופס
    };

    // בדיקה: האם כבר יש פרופיל למשתמש הזה?
    let profile = await CandidateProfile.findOne({ user: req.user.id });

    if (profile) {
      // אם יש - נעדכן אותו
      profile = await CandidateProfile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // אם אין - ניצור חדש
    profile = new CandidateProfile(profileFields);
    await profile.save();
    res.json(profile);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// שליפת הפרופיל של המשתמש הנוכחי
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({ user: req.user.id }).populate('user', ['fullName', 'email']);
    
    if (!profile) {
      return res.status(400).json({ msg: 'עדיין לא יצרת פרופיל' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// פונקציה לשליפת כל המועמדים (עבור השדכן)
exports.getAllCandidates = async (req, res) => {
  try {
    // נביא את כולם, ונחבר גם את השם והמייל מהטבלה של המשתמשים (populate)
    const candidates = await CandidateProfile.find().populate('user', ['fullName', 'email']);
    res.json(candidates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// מחיקת מועמד (רק לאדמין)
exports.deleteCandidate = async (req, res) => {
  try {
    // מחיקת הפרופיל מהדאטה בייס
    await CandidateProfile.findByIdAndDelete(req.params.id);
    // (במערכת אמיתית היינו מוחקים גם את ה-User, אבל זה מספיק לפרויקט)
    res.json({ msg: 'המועמד נמחק בהצלחה' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};