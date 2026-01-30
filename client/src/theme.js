import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'rtl', // תמיכה מלאה בעברית
  typography: {
    fontFamily: 'Rubik, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    button: { fontWeight: 600 },
  },
  palette: {
    primary: {
      main: '#1a237e', // כחול מלכותי עמוק (יוקרתי)
      light: '#534bae',
      dark: '#000051',
    },
    secondary: {
      main: '#ffb74d', // כתום/זהב עדין (נותן קונטרסט יפה לכחול)
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#1c1c1c',
      secondary: '#666666',
    },
  },
  components: {
    // עיצוב גלובלי לכל הכפתורים באתר
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12, // פינות מעוגלות
          textTransform: 'none', // ביטול אותיות גדולות באנגלית
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', // צל עדין בריחוף
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #1a237e 30%, #283593 90%)', // גרדיאנט לכפתורים ראשיים
        },
      },
    },
    // עיצוב גלובלי לכל הכרטיסים (Cards)
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20, // כרטיסים עגולים מאוד
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)', // צללית רכה ומודרנית ("Soft Shadow")
          border: '1px solid rgba(255, 255, 255, 0.5)',
        },
      },
    },
    // עיצוב שדות טקסט
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 20,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#ffffff', // נבבר לבן ונקי
          color: '#1a237e', // טקסט כחול
          boxShadow: '0 2px 20px rgba(0,0,0,0.05)', // צללית ממש עדינה למטה
        },
      },
    },
  },
});

export default theme;