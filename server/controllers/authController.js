const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. הרשמה (Register)
exports.register = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'משתמש זה כבר קיים במערכת' });
    }

    // --- לוגיקת האישור ---
    // אם נרשם שדכן -> לא מאושר (false).
    // אם נרשם מועמד או אדמין -> מאושר אוטומטית (true).
    const isApproved = role === 'shadchan' ? false : true;

    user = new User({
      fullName,
      email,
      password,
      role,
      isApproved // נשמר לדאטה בייס
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // אם המשתמש הוא שדכן (לא מאושר), לא מחזירים טוקן אלא הודעה
    if (!isApproved) {
      return res.status(201).json({ 
        msg: 'ההרשמה נקלטה. ממתין לאישור מנהל.',
        pendingApproval: true 
      });
    }

    // אם זה מועמד, מחזירים טוקן כרגיל
    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, fullName: user.fullName, role: user.role } });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// 2. התחברות (Login)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'פרטים שגויים' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'פרטים שגויים' });

    // --- בדיקת אישור כניסה ---
    if (user.isApproved === false) {
      return res.status(403).json({ msg: 'החשבון שלך עדיין ממתין לאישור מנהל המערכת.' });
    }

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, fullName: user.fullName, role: user.role } });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// 3. (לאדמין) קבלת רשימת ממתינים
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: false }).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// 4. (לאדמין) אישור משתמש
exports.approveUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.json({ msg: 'המשתמש אושר בהצלחה' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};