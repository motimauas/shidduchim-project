const Match = require('../models/Match');
const CandidateProfile = require('../models/Candidate');

// 1. יצירת שידוך חדש
exports.createMatch = async (req, res) => {
  try {
    const { candidateBoyId, candidateGirlId } = req.body;

    // בדיקה ששני הצדדים קיימים
    const boy = await CandidateProfile.findById(candidateBoyId);
    const girl = await CandidateProfile.findById(candidateGirlId);

    if (!boy || !girl) {
      return res.status(404).json({ msg: 'אחד המועמדים לא נמצא' });
    }

    const newMatch = new Match({
      shadchan: req.user.id, // השדכן שעשה את הפעולה
      candidateBoy: candidateBoyId,
      candidateGirl: candidateGirlId,
      status: 'Idea' // סטטוס התחלתי
    });

    const match = await newMatch.save();
    res.json(match);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// 2. קבלת שידוכים (חכם: מזהה אם זה שדכן או מועמד)
exports.getMyMatches = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = {};

    // אם זה מועמד רגיל (לא שדכן ולא אדמין), נביא לו רק את השידוכים שלו
    if (userRole !== 'shadchan' && userRole !== 'admin') {
      // קודם מוצאים את הפרופיל של המשתמש
      const myProfile = await CandidateProfile.findOne({ user: userId });
      
      if (!myProfile) {
        return res.json([]); // אם אין לו פרופיל, אין שידוכים
      }

      // השאילתה: תביא שידוכים שבהם אני הבחור או אני הבחורה
      query = { 
        $or: [
          { candidateBoy: myProfile._id }, 
          { candidateGirl: myProfile._id }
        ]
      };
    }

    // שליפת הנתונים מהדאטה בייס
    const matches = await Match.find(query)
      .populate({
        path: 'candidateBoy',
        populate: { path: 'user', select: 'fullName' }
      })
      .populate({
        path: 'candidateGirl',
        populate: { path: 'user', select: 'fullName' }
      })
      .sort({ date: -1 }); // הכי חדש למעלה

    res.json(matches);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// 3. עדכון סטטוס שידוך
exports.updateMatchStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // מעדכנים לפי ID השידוך
    let match = await Match.findByIdAndUpdate(
      req.params.id,
      { $set: { status: status, lastStatusUpdate: Date.now() } },
      { new: true }
    );

    if (!match) {
      return res.status(404).json({ msg: 'השידוך לא נמצא' });
    }

    res.json(match);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// 4. מחיקת שידוך (לאדמין)
exports.deleteMatch = async (req, res) => {
  try {
    await Match.findByIdAndDelete(req.params.id);
    res.json({ msg: 'השידוך נמחק בהצלחה' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};