import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, TextField, Button, Typography, 
  MenuItem, Select, InputLabel, FormControl, Grid, Box, Alert, CircularProgress, Chip 
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreateProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // שליפת המשתמש מהקונטקסט (כדי להציג את השם מיד)
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // האם אנחנו במצב עריכה?

  // המבנה של הטופס
  const [formData, setFormData] = useState({
    gender: 'male',
    age: '',
    height: '',
    city: '',
    status: 'single',
    sector: 'Litvak',
    occupation: '',
    institution: '',
    fatherName: '',
    motherName: '',
    familyBackground: '',
    lookingForMinAge: '',
    lookingForMaxAge: '',
    lookingForDescription: ''
  });

  // --- טעינת הנתונים בעת פתיחת הדף ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        // בקשה לשרת לקבל את הפרופיל שלי
        const res = await axios.get('https://shidduchim-project.onrender.com/api/profile/me', {
          headers: { 'x-auth-token': token }
        });

        // אם השרת החזיר נתונים (כלומר יש פרופיל)
        if (res.data) {
          const data = res.data;
          setIsEditMode(true); // אנחנו במצב עריכה

          // עדכון השדות בטופס עם מה שהגיע מהשרת
          setFormData({
            gender: data.gender || 'male',
            age: data.age || '',
            height: data.height || '',
            city: data.city || '',
            status: data.status || 'single',
            sector: data.sector || 'Litvak',
            occupation: data.occupation || '',
            institution: data.institution || '',
            fatherName: data.fatherName || '',
            motherName: data.motherName || '',
            familyBackground: data.familyBackground || '',
            // פירוק האובייקט הפנימי (lookingFor) לשדות שטוחים
            lookingForMinAge: data.lookingFor?.minAge || '',
            lookingForMaxAge: data.lookingFor?.maxAge || '',
            lookingForDescription: data.lookingFor?.description || ''
          });
        }
      } catch (err) {
        // שגיאת 400 אומרת שאין פרופיל עדיין - וזה בסדר גמור למשתמש חדש
        if (err.response && err.response.status === 400) {
          setIsEditMode(false); // מצב יצירה חדשה
        } else {
          console.error(err);
          setError('לא הצלחנו לטעון את הפרופיל. נסה לרענן.');
        }
      } finally {
        setLoading(false); // מפסיקים להציג את העיגול המסתובב
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');

    try {
      // המרת הנתונים למבנה שהשרת מצפה לו
      const payload = {
        ...formData,
        lookingFor: {
          minAge: formData.lookingForMinAge,
          maxAge: formData.lookingForMaxAge,
          description: formData.lookingForDescription
        }
      };

      await axios.post('https://shidduchim-project.onrender.com/api/profile', payload, {
        headers: { 'x-auth-token': token }
      });

      setSuccess(true);
      window.scrollTo(0, 0); // גלילה למעלה כדי לראות את ההודעה הירוקה
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      console.error(err);
      setError('שגיאה בשמירת הפרופיל.');
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" style={{ marginTop: 30, marginBottom: 50 }}>
      <Paper elevation={3} style={{ padding: 30, borderRadius: 20 }}>
        
        {/* כותרת עם השם שלך */}
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" mb={3}>
           <Typography variant="h4" color="primary" fontWeight="bold">
             {isEditMode ? 'עריכת כרטיס שידוך' : 'יצירת כרטיס שידוך'}
           </Typography>
           
           {/* הצגת השם מתוך המשתמש המחובר */}
           <Chip 
             icon={<AccountCircle />} 
             label={user?.fullName || "משתמש"} 
             color="secondary" 
             variant="outlined" 
             sx={{ mt: 1, fontSize: '1.1rem', padding: 1 }}
           />
        </Box>
        
        <Typography variant="subtitle1" align="center" style={{ marginBottom: 30, color: '#666' }}>
          {isEditMode 
            ? 'כאן תוכל לעדכן את הפרטים שיראו השדכנים.' 
            : 'מלא את הפרטים כדי שהשדכנים יוכלו למצוא לך את ההתאמה המושלמת.'}
        </Typography>

        {success && <Alert severity="success" sx={{ mb: 3 }}>הפרופיל עודכן בהצלחה!</Alert>}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            
            {/* --- פרטים אישיים --- */}
            <Grid item xs={12}><Typography variant="h6" color="primary" sx={{ borderBottom: '2px solid #eee', pb: 1 }}>פרטים אישיים</Typography></Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>מין</InputLabel>
                <Select name="gender" value={formData.gender} label="מין" onChange={handleChange}>
                  <MenuItem value="male">בחור</MenuItem>
                  <MenuItem value="female">בחורה</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>מצב משפחתי</InputLabel>
                <Select name="status" value={formData.status} label="מצב משפחתי" onChange={handleChange}>
                  <MenuItem value="single">רווק/ה</MenuItem>
                  <MenuItem value="divorced">גרוש/ה</MenuItem>
                  <MenuItem value="widowed">אלמן/ה</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} sm={4}>
              <TextField fullWidth required label="גיל" name="age" type="number" value={formData.age} onChange={handleChange} />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField fullWidth required label="גובה (ס''מ)" name="height" type="number" value={formData.height} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth required label="עיר מגורים" name="city" value={formData.city} onChange={handleChange} />
            </Grid>

            {/* --- רקע והשקפה --- */}
            <Grid item xs={12}><Typography variant="h6" color="primary" sx={{ mt: 2, borderBottom: '2px solid #eee', pb: 1 }}>רקע והשקפה</Typography></Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>מגזר / סגנון</InputLabel>
                <Select name="sector" value={formData.sector} label="מגזר / סגנון" onChange={handleChange}>
                  <MenuItem value="Litvak">ליטאי</MenuItem>
                  <MenuItem value="Chasid">חסידי</MenuItem>
                  <MenuItem value="Sefaradi">ספרדי</MenuItem>
                  <MenuItem value="Chabad">חב"ד</MenuItem>
                  <MenuItem value="Modern">מודרני</MenuItem>
                  <MenuItem value="BaalTshuva">בעל תשובה</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="ישיבה / סמינר" name="institution" value={formData.institution} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="עיסוק נוכחי" name="occupation" value={formData.occupation} onChange={handleChange} />
            </Grid>

            {/* --- משפחה --- */}
            <Grid item xs={12}><Typography variant="h6" color="primary" sx={{ mt: 2, borderBottom: '2px solid #eee', pb: 1 }}>רקע משפחתי</Typography></Grid>
            
            <Grid item xs={6}>
              <TextField fullWidth label="שם האב" name="fatherName" value={formData.fatherName} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="שם האם" name="motherName" value={formData.motherName} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="רקע משפחתי כללי" name="familyBackground" value={formData.familyBackground} onChange={handleChange} />
            </Grid>

            {/* --- מה אני מחפש --- */}
            <Grid item xs={12}><Typography variant="h6" color="primary" sx={{ mt: 2, borderBottom: '2px solid #eee', pb: 1 }}>מה אני מחפש/ת?</Typography></Grid>
            
            <Grid item xs={6}>
              <TextField fullWidth label="גיל מינימלי" name="lookingForMinAge" type="number" value={formData.lookingForMinAge} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="גיל מקסימלי" name="lookingForMaxAge" type="number" value={formData.lookingForMaxAge} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="תיאור בן/בת הזוג המבוקשים" name="lookingForDescription" value={formData.lookingForDescription} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} style={{ marginTop: 30 }}>
              <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ py: 1.5, fontSize: '1.1rem', borderRadius: 50 }}>
                {isEditMode ? 'שמור שינויים ועדכן' : 'צור פרופיל'}
              </Button>
            </Grid>

          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateProfilePage;