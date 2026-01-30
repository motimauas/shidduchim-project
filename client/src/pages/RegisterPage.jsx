import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, FormControl, InputLabel, Select, MenuItem, Link as MuiLink } from '@mui/material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'candidate' // ברירת מחדל: מועמד
  });
  const [error, setError] = useState('');
  const [info, setInfo] = useState(''); // להודעות הצלחה (כמו המתנה לאישור)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    try {
      const res = await axios.post('https://shidduchim-project.onrender.com/api/auth/register', formData);
      
      // בדיקה: האם השרת אמר שצריך אישור? (עבור שדכנים)
      if (res.data.pendingApproval) {
        setInfo('הרשמתך התקבלה בהצלחה! מנהל המערכת יאשר את חשבונך בקרוב, ורק אז תוכל להתחבר.');
      } else {
        // מועמדים נכנסים רגיל
        alert('נרשמת בהצלחה! כעת תוכל להתחבר.');
        navigate('/login');
      }

    } catch (err) {
      setError(err.response?.data?.msg || 'שגיאה בהרשמה');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '30px', marginTop: '50px' }}>
        <Typography variant="h4" align="center" gutterBottom color="primary" fontWeight="bold">
          הרשמה למערכת
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {info && <Alert severity="info" sx={{ mb: 2 }}>{info}</Alert>}

        {/* אם יש הודעת המתנה, מסתירים את הטופס כדי לא לבלבל */}
        {!info && (
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="שם מלא" name="fullName" value={formData.fullName} onChange={handleChange} margin="normal" required />
            <TextField fullWidth label="אימייל" name="email" value={formData.email} onChange={handleChange} margin="normal" required />
            <TextField fullWidth type="password" label="סיסמה" name="password" value={formData.password} onChange={handleChange} margin="normal" required />

            <FormControl fullWidth margin="normal">
              <InputLabel>אני נרשם כ...</InputLabel>
              <Select name="role" value={formData.role} label="אני נרשם כ..." onChange={handleChange}>
                <MenuItem value="candidate">מועמד/ת לשידוך (כניסה מיידית)</MenuItem>
                <MenuItem value="shadchan">שדכן/ית (דורש אישור מנהל)</MenuItem>
              </Select>
            </FormControl>

            <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 3, py: 1.5 }}>
              סיום והרשמה
            </Button>
          </form>
        )}

        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            יש לך כבר חשבון? {' '}
            <MuiLink component={Link} to="/login" underline="hover" fontWeight="bold">
              התחבר כאן
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;