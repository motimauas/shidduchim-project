import React from 'react';
import { Button, Container, Typography, Box, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { HowToReg, Login, Diamond } from '@mui/icons-material';

// תמונת רקע איכותית (אפשר להחליף את הקישור לתמונה משלך אחר כך)
const HERO_IMAGE = "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";

const HomePage = () => {
  return (
    // המיכל הראשי - תופס את כל המסך וכולל את תמונת הרקע
    <Box
      sx={{
        backgroundImage: `linear-gradient(rgba(26, 35, 126, 0.8), rgba(26, 35, 126, 0.8)), url(${HERO_IMAGE})`, // שכבה כחולה כהה מעל התמונה
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '90vh', // כמעט גובה מסך מלא
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        marginTop: '-30px', // ביטול הריווח של ה-Container הראשי
        paddingTop: '30px'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* צד ימין - הטקסטים */}
          <Grid item xs={12} md={7}>
            <Box display="flex" alignItems="center" mb={2}>
              <Diamond sx={{ fontSize: 40, color: '#ffb74d', marginRight: 2 }} />
              <Typography variant="h6" color="secondary" fontWeight="bold">
                שידוכים-טק
              </Typography>
            </Box>

            <Typography variant="h2" component="h1" fontWeight="800" gutterBottom sx={{ lineHeight: 1.2 }}>
              הדרך החכמה, הדיסקרטית והמודרנית לחופה.
            </Typography>
            
            <Typography variant="h5" paragraph sx={{ opacity: 0.9, maxWidth: '600px', mb: 4 }}>
              מערכת CRM מתקדמת לשדכנים, וחווית משתמש נקייה למועמדים. 
              אנחנו משלבים טכנולוגיה עילית עם שמירה על מסורת וצניעות.
            </Typography>
            
            {/* כפתורי פעולה */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large" 
                component={Link} 
                to="/register"
                startIcon={<HowToReg />}
                sx={{ fontSize: '1.1rem', padding: '12px 30px' }}
              >
                הצטרפו עכשיו כמנוי / שדכן
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                size="large" 
                component={Link} 
                to="/login"
                startIcon={<Login />}
                sx={{ fontSize: '1.1rem', padding: '12px 30px', borderColor: 'white', color: 'white' }}
              >
                כניסה למערכת
              </Button>
            </Box>
          </Grid>
          
          {/* צד שמאל - אפשר להוסיף כאן תמונה נוספת או להשאיר ריק כדי שיראו את הרקע */}
          <Grid item xs={12} md={5}>
             {/* אפשר להוסיף כאן אלמנט ויזואלי נוסף בעתיד */}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;