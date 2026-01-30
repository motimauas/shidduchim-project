import React, { useState } from 'react';
import { 
  Container, Paper, TextField, Button, Typography, Box, Alert, 
  InputAdornment, IconButton, Link as MuiLink 
} from '@mui/material';
import { Visibility, VisibilityOff, Login, PersonAdd } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ייבוא ה-Hook לניהול משתמשים

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // שימוש בפונקציית הלוגין הגלובלית

  // סטייטים (נתונים משתנים)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false); // להצגת הסיסמה
  const [error, setError] = useState('');

  // עדכון השדות בטופס
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // שליחת הטופס
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('https://shidduchim-project.onrender.com/api/auth/login', formData);
      
      // 1. עדכון הקונטקסט הגלובלי (שומר את הטוקן והמשתמש)
      login(res.data.token, res.data.user);
      
      // 2. ניתוב חכם לפי תפקיד
      // אם זה שדכן -> שלח אותו ישר לעבוד בדשבורד
      if (res.data.user.role === 'shadchan' || res.data.user.role === 'admin') {
        navigate('/dashboard');
      } else {
        // אם זה מועמד -> שלח אותו לראות את הפרופיל שלו
        navigate('/create-profile');
      }

    } catch (err) {
      setError(err.response?.data?.msg || 'שגיאה בהתחברות. בדוק את הפרטים ונסה שוב.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={4} style={{ padding: '40px', marginTop: '60px', textAlign: 'center' }}>
        
        {/* כותרת */}
        <Box mb={3}>
          <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
            כניסה למערכת
          </Typography>
          <Typography variant="body2" color="textSecondary">
            שמחים שחזרתם אלינו
          </Typography>
        </Box>

        {/* הודעת שגיאה אם יש */}
        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          {/* אימייל */}
          <TextField
            fullWidth
            label="כתובת אימייל"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            autoFocus
          />

          {/* סיסמה עם כפתור "עין" */}
          <TextField
            fullWidth
            label="סיסמה"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* כפתור התחברות */}
          <Box mt={4} mb={2}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              size="large"
              startIcon={<Login />}
              sx={{ py: 1.5, fontSize: '1.1rem' }}
            >
              התחברות
            </Button>
          </Box>

          {/* קישור להרשמה */}
          <Box mt={2}>
            <Typography variant="body2">
              עדיין אין לך משתמש? {' '}
              <MuiLink component={Link} to="/register" underline="hover" sx={{ fontWeight: 'bold' }}>
                הירשם כאן
              </MuiLink>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;