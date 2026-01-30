import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. המילון שלנו - כל המילים באתר בעברית ובאנגלית
const translations = {
  he: {
    home: 'בית',
    login: 'כניסה',
    register: 'הרשמה',
    logout: 'התנתקות',
    profile: 'הפרופיל שלי',
    dashboard: 'מאגר השידוכים',
    matches: 'ניהול הצעות',
    brand: 'שידוכים-טק',
    hello: 'שלום',
    role_shadchan: 'שדכן/ית',
    role_candidate: 'מועמד/ת',
    settings_tooltip: 'פתיחת הגדרות'
  },
  en: {
    home: 'Home',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    profile: 'My Profile',
    dashboard: 'Match Database',
    matches: 'CRM / Matches',
    brand: 'Shidduchim-Tech',
    hello: 'Hello',
    role_shadchan: 'Shadchan',
    role_candidate: 'Candidate',
    settings_tooltip: 'Open settings'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('he'); // ברירת מחדל: עברית

  // פונקציה להחלפת שפה
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'he' ? 'en' : 'he'));
  };

  // אפקט שמשנה את כיוון הדף (RTL/LTR) אוטומטית
  useEffect(() => {
    document.body.dir = language === 'he' ? 'rtl' : 'ltr';
  }, [language]);

  // פונקציית התרגום - מקבלת מפתח ומחזירה את המילה בשפה הנכונה
  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);