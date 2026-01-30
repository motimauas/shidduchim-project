const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. קבלת הטוקן מהכותרת של הבקשה (Header)
  const token = req.header('x-auth-token');

  // 2. אם אין טוקן - עצור הכל
  if (!token) {
    return res.status(401).json({ msg: 'אין אישור גישה, חסר טוקן' });
  }

  // 3. אם יש טוקן - נסה לפענח אותו
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // שומרים את פרטי המשתמש בתוך הבקשה
    next(); // ממשיכים לפונקציה הבאה
  } catch (err) {
    res.status(401).json({ msg: 'הטוקן אינו תקין' });
  }
};