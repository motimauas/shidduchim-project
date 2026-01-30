import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. יצירת הקונטקסט (ה"צינור" שמעביר את המידע)
const AuthContext = createContext(null);

// 2. יצירת ה"ספק" (Provider) - הרכיב שעוטף את האפליקציה ומחזיק את המידע
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // כאן נשמור את פרטי המשתמש המחובר
  const [token, setToken] = useState(localStorage.getItem('token')); // כאן נשמור את הטוקן
  const [loading, setLoading] = useState(true); // האם אנחנו עדיין בודקים אם הוא מחובר?

  // בעת טעינת האתר, נבדוק אם יש טוקן שמור בזיכרון
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser)); // הופכים את המחרוזת חזרה לאובייקט
    }
    setLoading(false); // סיימנו לבדוק
  }, []);

  // פונקציית התחברות (תקרא מדף הלוגין)
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  // פונקציית התנתקות (תקרא מהנבבר)
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    window.location.href = '/'; // מעבר לדף הבית
  };

  // המידע שאנחנו חושפים לכל האפליקציה
  const value = {
    user,     // האובייקט של המשתמש (כולל ה-Role שלו!)
    token,
    login,
    logout,
    isAuthenticated: !!user, // האם מחובר (כן/לא)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* מציגים את האתר רק אחרי שסיימנו לבדוק התחברות */}
    </AuthContext.Provider>
  );
};

// Hook מותאם אישית כדי להשתמש בקונטקסט בקלות בדפים אחרים
export const useAuth = () => {
  return useContext(AuthContext);
};