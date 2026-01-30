import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

// ייבוא העיצובים
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'; // הקובץ שיצרנו
import CssBaseline from '@mui/material/CssBaseline'; // איפוס הגדרות דפדפן
import './index.css'; // הפונטים והרקע

// תמיכה ב-RTL (יישור לימין לעברית)
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { AuthProvider } from './context/AuthContext'; // <-- הוסף את זה
import { LanguageProvider } from './context/LanguageContext';

// יצירת הגדרות RTL
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* מנקה את העיצובים של הדפדפן */}
        <AuthProvider>
          <LanguageProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>,
);