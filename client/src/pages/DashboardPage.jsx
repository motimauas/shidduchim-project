import React, { useEffect, useState } from 'react';
import { 
  Container, Grid, Card, CardContent, Typography, CardActions, Button, 
  Chip, Avatar, CircularProgress, Box, Alert, Dialog, DialogTitle, 
  DialogContent, List, ListItem, ListItemAvatar, ListItemText, ListItemButton,
  TextField, FormControl, InputLabel, Select, MenuItem, IconButton, Paper, Collapse
} from '@mui/material';
import { Face, Face3, Height, LocationOn, School, Favorite, Search, FilterList, Delete, CheckCircle } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]); // שדכנים בהמתנה
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // פילטרים
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    name: '', gender: 'all', minAge: '', maxAge: '', city: '', sector: 'all'
  });

  // דיאלוג שידוך
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [potentialPartners, setPotentialPartners] = useState([]);

  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchCandidates();
    if (isAdmin) {
      fetchPendingUsers();
    }
  }, [isAdmin]);

  // טעינת מועמדים
  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      const res = await axios.get('https://shidduchim-project.onrender.com/api/profile/all', {
        headers: { 'x-auth-token': token }
      });
      setCandidates(res.data);
      setFilteredCandidates(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('לא הצלחנו לטעון את הנתונים.');
      setLoading(false);
    }
  };

  // טעינת שדכנים בהמתנה (לאדמין)
  const fetchPendingUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://shidduchim-project.onrender.com/api/auth/pending', {
        headers: { 'x-auth-token': token }
      });
      setPendingUsers(res.data);
    } catch (err) {
      console.error("Error fetching pending users");
    }
  };

  // אישור שדכן (לאדמין)
  const handleApproveUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://shidduchim-project.onrender.com/api/auth/approve/${userId}`, {}, {
         headers: { 'x-auth-token': token }
      });
      alert('המשתמש אושר בהצלחה!');
      setPendingUsers(pendingUsers.filter(u => u._id !== userId));
    } catch (err) {
      alert('שגיאה באישור המשתמש');
    }
  };

  // לוגיקת סינון
  useEffect(() => {
    let result = candidates;
    if (filters.name) result = result.filter(c => c.user?.fullName.includes(filters.name));
    if (filters.gender !== 'all') result = result.filter(c => c.gender === filters.gender);
    if (filters.city) result = result.filter(c => c.city.includes(filters.city));
    if (filters.sector !== 'all') result = result.filter(c => c.sector === filters.sector);
    if (filters.minAge) result = result.filter(c => c.age >= filters.minAge);
    if (filters.maxAge) result = result.filter(c => c.age <= filters.maxAge);
    setFilteredCandidates(result);
  }, [filters, candidates]);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleDeleteCandidate = async (id) => {
    if (!window.confirm('למחוק מועמד זה?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://shidduchim-project.onrender.com/api/profile/${id}`, {
        headers: { 'x-auth-token': token }
      });
      setCandidates(candidates.filter(c => c._id !== id));
    } catch (err) { alert('שגיאה במחיקה'); }
  };

  const handleOpenMatch = (candidate) => {
    setSelectedCandidate(candidate);
    const partners = candidates.filter(c => c.gender !== candidate.gender);
    setPotentialPartners(partners);
    setOpenDialog(true);
  };

  const handleCreateMatch = async (partner) => {
    try {
      const token = localStorage.getItem('token');
      const boyId = selectedCandidate.gender === 'male' ? selectedCandidate._id : partner._id;
      const girlId = selectedCandidate.gender === 'female' ? selectedCandidate._id : partner._id;
      await axios.post('https://shidduchim-project.onrender.com/api/matches', 
        { candidateBoyId: boyId, candidateGirlId: girlId },
        { headers: { 'x-auth-token': token } }
      );
      alert(`שידוך נוצר בהצלחה!`);
      setOpenDialog(false);
    } catch (err) { alert('שגיאה ביצירת השידוך'); }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

  return (
    <Container maxWidth="lg" style={{ marginTop: 40, marginBottom: 40 }}>
      
      {/* --- איזור אדמין: אישור שדכנים --- */}
      {isAdmin && pendingUsers.length > 0 && (
        <Paper sx={{ p: 3, mb: 4, bgcolor: '#fff3e0', border: '1px solid #ffb74d' }}>
          <Typography variant="h6" color="warning.main" gutterBottom fontWeight="bold">
            🔔 ישנם {pendingUsers.length} שדכנים שממתינים לאישור שלך:
          </Typography>
          <Grid container spacing={2}>
            {pendingUsers.map(u => (
              <Grid item xs={12} sm={6} md={4} key={u._id}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">{u.fullName}</Typography>
                    <Typography variant="body2" color="text.secondary">{u.email}</Typography>
                    <Button 
                      variant="contained" 
                      color="success" 
                      size="small" 
                      fullWidth 
                      sx={{ mt: 2 }}
                      startIcon={<CheckCircle />}
                      onClick={() => handleApproveUser(u._id)}
                    >
                      אשר כניסה
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* כותרת וכפתור פתיחת סינון */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          מאגר המועמדים ({filteredCandidates.length})
        </Typography>
        <Button startIcon={<FilterList />} variant="outlined" onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? 'הסתר סינון' : 'סינון וחיפוש מתקדם'}
        </Button>
      </Box>
      
      {/* סרגל הסינון */}
      <Collapse in={showFilters}>
        <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: '#fff' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField fullWidth size="small" label="חפש לפי שם" name="name" value={filters.name} onChange={handleFilterChange} InputProps={{ endAdornment: <Search color="action" /> }} />
            </Grid>
            <Grid item xs={6} sm={2}>
              <FormControl fullWidth size="small">
                <InputLabel>מין</InputLabel>
                <Select name="gender" value={filters.gender} label="מין" onChange={handleFilterChange}>
                  <MenuItem value="all">הכל</MenuItem>
                  <MenuItem value="male">בחורים</MenuItem>
                  <MenuItem value="female">בחורות</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={2}>
               <FormControl fullWidth size="small"><InputLabel>מגזר</InputLabel><Select name="sector" value={filters.sector} label="מגזר" onChange={handleFilterChange}><MenuItem value="all">הכל</MenuItem><MenuItem value="Litvak">ליטאי</MenuItem><MenuItem value="Chasid">חסידי</MenuItem><MenuItem value="Sefaradi">ספרדי</MenuItem><MenuItem value="Chabad">חב"ד</MenuItem><MenuItem value="Modern">מודרני</MenuItem></Select></FormControl>
            </Grid>
            <Grid item xs={6} sm={2}><TextField fullWidth size="small" type="number" label="מגיל" name="minAge" value={filters.minAge} onChange={handleFilterChange} /></Grid>
            <Grid item xs={6} sm={2}><TextField fullWidth size="small" type="number" label="עד גיל" name="maxAge" value={filters.maxAge} onChange={handleFilterChange} /></Grid>
            <Grid item xs={12} sm={1}><Button fullWidth variant="text" onClick={() => setFilters({ name: '', gender: 'all', minAge: '', maxAge: '', city: '', sector: 'all' })}>ניקוי</Button></Grid>
          </Grid>
        </Paper>
      </Collapse>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={3}>
        {filteredCandidates.map((candidate) => (
          <Grid item xs={12} sm={6} md={4} key={candidate._id}>
            <Card elevation={4} style={{ borderRadius: 15, position: 'relative' }}>
              {isAdmin && (
                <IconButton size="small" onClick={() => handleDeleteCandidate(candidate._id)} sx={{ position: 'absolute', top: 10, left: 10, bgcolor: 'white', color: 'red', zIndex: 10 }}>
                  <Delete fontSize="small" />
                </IconButton>
              )}
              <div style={{ height: 8, backgroundColor: candidate.gender === 'male' ? '#1976d2' : '#e91e63' }} />
              <CardContent>
                <Box display="flex" alignItems="center" marginBottom={2}>
                  <Avatar style={{ backgroundColor: candidate.gender === 'male' ? '#e3f2fd' : '#fce4ec', color: candidate.gender === 'male' ? '#1976d2' : '#e91e63' }}>
                    {candidate.gender === 'male' ? <Face /> : <Face3 />}
                  </Avatar>
                  <Box marginRight={2}>
                    <Typography variant="h6" fontWeight="bold">{candidate.user?.fullName}</Typography>
                    <Typography variant="body2" color="textSecondary">{candidate.sector} • גיל {candidate.age}</Typography>
                  </Box>
                </Box>
                <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                  <Chip icon={<LocationOn style={{ fontSize: 16 }} />} label={candidate.city} size="small" />
                  <Chip icon={<Height style={{ fontSize: 16 }} />} label={`${candidate.height} ס"מ`} size="small" />
                </Box>
                <Typography variant="body2" noWrap><School fontSize="small" /> {candidate.institution}</Typography>
              </CardContent>
              <CardActions style={{ justifyContent: 'center', padding: 16, borderTop: '1px solid #eee' }}>
                <Button fullWidth variant="contained" color="primary" startIcon={<Favorite />} onClick={() => handleOpenMatch(candidate)}>הצע שידוך</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>שידוך עבור {selectedCandidate?.user?.fullName}</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>בחר התאמה מהרשימה:</Typography>
          {potentialPartners.length === 0 ? <Alert severity="info">אין מועמדים מתאימים.</Alert> : (
            <List>
              {potentialPartners.map((partner) => (
                <ListItem disablePadding key={partner._id}>
                  <ListItemButton onClick={() => handleCreateMatch(partner)}>
                    <ListItemAvatar><Avatar style={{ backgroundColor: partner.gender === 'male' ? '#e3f2fd' : '#fce4ec' }}>{partner.gender === 'male' ? <Face /> : <Face3 />}</Avatar></ListItemAvatar>
                    <ListItemText primary={partner.user?.fullName} secondary={`${partner.age} • ${partner.city}`} />
                    <Button variant="outlined" size="small">שדך</Button>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <Box p={2}><Button onClick={() => setOpenDialog(false)}>ביטול</Button></Box>
      </Dialog>
    </Container>
  );
};

export default DashboardPage;