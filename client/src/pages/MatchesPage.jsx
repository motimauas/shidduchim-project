import React, { useEffect, useState } from 'react';
import { 
  Container, Grid, Card, CardContent, Typography, Box, 
  Select, MenuItem, FormControl, InputLabel, Chip, CircularProgress, Alert, IconButton
} from '@mui/material';
import { AccessTime, CheckCircle, Event, Favorite, Cancel, Lightbulb, Delete } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ייבוא לבדיקת הרשאות

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth(); // בדיקת המשתמש המחובר

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }

      const res = await axios.get('https://shidduchim-project.onrender.com/api/matches', {
        headers: { 'x-auth-token': token }
      });
      setMatches(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleStatusChange = async (matchId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://shidduchim-project.onrender.com/api/matches/${matchId}`, 
        { status: newStatus },
        { headers: { 'x-auth-token': token } }
      );
      setMatches(matches.map(match => match._id === matchId ? { ...match, status: newStatus } : match));
    } catch (err) {
      alert('שגיאה בעדכון הסטטוס');
    }
  };

  // --- פונקציית מחיקת שידוך (לאדמין) ---
  const handleDeleteMatch = async (matchId) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את הצעת השידוך הזו?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://shidduchim-project.onrender.com/api/matches/${matchId}`, {
         headers: { 'x-auth-token': token }
      });
      setMatches(matches.filter(m => m._id !== matchId)); // הסרה מהמסך
    } catch (err) {
      alert('שגיאה במחיקה');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Idea': return { color: '#9c27b0', icon: <Lightbulb />, label: 'רעיון ראשוני' };
      case 'Proposed': return { color: '#ff9800', icon: <AccessTime />, label: 'הוצע לצדדים' };
      case 'Approved': return { color: '#2196f3', icon: <CheckCircle />, label: 'אושר - ממשיכים' };
      case 'FirstDate': return { color: '#00bcd4', icon: <Event />, label: 'דייט ראשון' };
      case 'Dating': return { color: '#e91e63', icon: <Favorite />, label: 'יוצאים קבוע' };
      case 'Engaged': return { color: '#4caf50', icon: <Favorite fontSize="large" />, label: 'מאורסים בשעה טובה!' };
      case 'Dropped': return { color: '#607d8b', icon: <Cancel />, label: 'ירד מהפרק' };
      default: return { color: '#9e9e9e', icon: <AccessTime />, label: 'סטטוס לא ידוע' };
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" style={{ marginTop: 40 }}>
      <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', color: '#1a237e' }}>
        ניהול השידוכים 📋
      </Typography>

      {matches.length === 0 ? (
        <Alert severity="info">אין שידוכים להצגה.</Alert>
      ) : (
        <Grid container spacing={3}>
          {matches.map((match) => {
            const statusInfo = getStatusColor(match.status);
            
            return (
              <Grid item xs={12} md={6} key={match._id}>
                <Card elevation={3} style={{ borderRight: `6px solid ${statusInfo.color}`, borderRadius: 15, position: 'relative' }}>
                  
                  {/* --- כפתור מחיקה (רק לאדמין) --- */}
                  {isAdmin && (
                    <IconButton 
                      onClick={() => handleDeleteMatch(match._id)}
                      sx={{ position: 'absolute', top: 5, left: 5, color: '#bdbdbd', '&:hover': { color: 'red' } }}
                    >
                      <Delete />
                    </IconButton>
                  )}

                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} pr={isAdmin ? 4 : 0}>
                      <Typography variant="h6" fontWeight="bold">
                        {match.candidateBoy?.user?.fullName} & {match.candidateGirl?.user?.fullName}
                      </Typography>
                      <Chip 
                        icon={statusInfo.icon} 
                        label={statusInfo.label} 
                        style={{ backgroundColor: statusInfo.color + '20', color: statusInfo.color, fontWeight: 'bold' }} 
                      />
                    </Box>

                    <FormControl fullWidth size="small" style={{ marginTop: 15 }}>
                      <InputLabel>עדכן סטטוס</InputLabel>
                      <Select
                        value={match.status}
                        label="עדכן סטטוס"
                        onChange={(e) => handleStatusChange(match._id, e.target.value)}
                      >
                        <MenuItem value="Idea">💡 רעיון ראשוני</MenuItem>
                        <MenuItem value="Proposed">📞 הוצע לצדדים</MenuItem>
                        <MenuItem value="Approved">✅ אושר ע"י הצדדים</MenuItem>
                        <MenuItem value="FirstDate">☕ פגישה ראשונה</MenuItem>
                        <MenuItem value="Dating">💞 בפגישות מתקדמות</MenuItem>
                        <MenuItem value="Engaged">💍 מאורסים!</MenuItem>
                        <MenuItem value="Dropped">❌ ירד מהפרק</MenuItem>
                      </Select>
                    </FormControl>

                    <Typography variant="caption" display="block" style={{ marginTop: 10, color: '#888' }}>
                      עודכן: {new Date(match.lastStatusUpdate).toLocaleDateString('he-IL')}
                    </Typography>
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

export default MatchesPage;