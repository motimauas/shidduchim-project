import React, { useEffect, useState } from 'react';
import { 
  Container, Grid, Card, CardContent, Typography, Box, 
  Chip, CircularProgress, Alert, Divider, Avatar, Button
} from '@mui/material';
import { School, Height, Info, WhatsApp } from '@mui/icons-material'; // הוספנו אייקון וואטסאפ
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MyProposalsPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyMatches = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://shidduchim-project.onrender.com/api/matches', {
          headers: { 'x-auth-token': token }
        });
        setMatches(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyMatches();
  }, []);

  const getStatusLabel = (status) => {
    switch(status) {
      case 'Idea': return { text: 'בבדיקת שדכן', color: '#9e9e9e' };
      case 'Proposed': return { text: 'הצעה חדשה!', color: '#ff9800' };
      case 'Approved': return { text: 'בבדיקה הדדית', color: '#2196f3' };
      case 'FirstDate': return { text: 'נקבעה פגישה', color: '#00bcd4' };
      case 'Dating': return { text: 'יוצאים', color: '#e91e63' };
      case 'Engaged': return { text: 'מאורסים בשעה טובה', color: '#4caf50' };
      case 'Dropped': return { text: 'ירד מהפרק', color: '#607d8b' };
      default: return { text: 'סטטוס לא ידוע', color: '#grey' };
    }
  };

  // --- הפונקציה החדשה לפתיחת וואטסאפ ---
  const handleContactShadchan = (partnerName, matchId) => {
    // כאן היינו שמים את הטלפון של השדכן מהדאטה בייס.
    // כרגע נשים מספר לדוגמה (תחליף למספר שלך כדי לבדוק)
    const phoneNumber = "972526105421"; 
    
    const message = `שלום, אני פונה בקשר לשידוך מספר ${matchId} עם ${partnerName}. אשמח לשמוע פרטים נוספים.`;
    
    // פתיחת הקישור בחלון חדש
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" style={{ marginTop: 40, marginBottom: 50 }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', textAlign: 'center', color: '#1a237e' }}>
        ההצעות שלי 💌
      </Typography>

      {matches.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>עדיין אין הצעות פעילות. השדכנים עובדים על זה :)</Alert>
      ) : (
        <Grid container spacing={3}>
          {matches.map((match) => {
            const isMeTheBoy = match.candidateBoy?.user?.fullName === user?.fullName;
            const partner = isMeTheBoy ? match.candidateGirl : match.candidateBoy;

            if (!partner) return null;

            const statusInfo = getStatusLabel(match.status);

            return (
              <Grid item xs={12} key={match._id}>
                <Card elevation={4} sx={{ borderRadius: 4, overflow: 'visible', mt: 2 }}>
                  <Box sx={{ bgcolor: statusInfo.color, height: 10 }} /> 
                  
                  <CardContent sx={{ position: 'relative', pt: 3 }}>
                    <Chip 
                      label={statusInfo.text} 
                      sx={{ 
                        position: 'absolute', top: -15, left: 20, 
                        bgcolor: 'white', border: `2px solid ${statusInfo.color}`, 
                        fontWeight: 'bold', color: statusInfo.color 
                      }} 
                    />

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <Typography variant="h5" fontWeight="bold">
                          {partner.user?.fullName}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          {partner.age} • {partner.city} • {partner.sector}
                        </Typography>

                        <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                          <Chip size="small" icon={<School />} label={partner.institution} />
                          <Chip size="small" icon={<Height />} label={`${partner.height} ס"מ`} />
                          <Chip size="small" icon={<Info />} label={partner.status === 'single' ? 'רווק/ה' : partner.status} />
                        </Box>

                        <Box mt={2} bgcolor="#f5f5f5" p={2} borderRadius={2}>
                          <Typography variant="body2" fontWeight="bold">רקע:</Typography>
                          <Typography variant="body2" color="text.secondary">
                             {partner.familyBackground || 'אין מידע נוסף.'}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={4} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                         <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: statusInfo.color + '40', color: statusInfo.color }}>
                            {partner.gender === 'male' ? 'בן' : 'בת'}
                         </Avatar>
                         
                         {/* --- הכפתור הפעיל --- */}
                         <Button 
                           variant="contained" 
                           color="success" // צבע ירוק של וואטסאפ
                           fullWidth
                           startIcon={<WhatsApp />}
                           onClick={() => handleContactShadchan(partner.user?.fullName, match._id)}
                         >
                           דבר עם השדכן
                         </Button>

                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default MyProposalsPage;