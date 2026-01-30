import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Menu, MenuItem, Avatar, Tooltip } from '@mui/material';
import { Favorite, People, Person, Home, Login, Logout, HowToReg } from '@mui/icons-material';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';

// ייבוא כל הדפים
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateProfilePage from './pages/CreateProfilePage';
import DashboardPage from './pages/DashboardPage';
import MatchesPage from './pages/MatchesPage';
import MyProposalsPage from './pages/MyProposalsPage'; // <-- הייבוא החדש

function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage(); 
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
  };

  const isShadchanOrAdmin = user?.role === 'shadchan' || user?.role === 'admin';

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'primary.main' }}>
        <Toolbar>
          
          {/* כפתור דגל שפה */}
          <Tooltip title="Switch Language / החלף שפה">
            <IconButton onClick={toggleLanguage} sx={{ mr: 1 }}>
              <Box 
                component="img"
                src={language === 'he' ? "https://flagcdn.com/w40/us.png" : "https://flagcdn.com/w40/il.png"}
                alt="language flag"
                sx={{ width: 24, height: 'auto', borderRadius: '2px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} 
              />
            </IconButton>
          </Tooltip>

          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, fontWeight: '900', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
             💎 {t('brand')}
          </Typography>
          
          {/* תפריט ניווט */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            <Button color="inherit" component={Link} to="/" startIcon={<Home />}>{t('home')}</Button>

            {isAuthenticated && (
              <>
                {/* איזור לשדכנים/מנהלים בלבד */}
                {isShadchanOrAdmin && (
                  <>
                     <Button 
                      component={Link} 
                      to="/dashboard" 
                      startIcon={<People />}
                      variant="contained"
                      color="primary"
                      sx={{ borderRadius: '20px', px: 3 }}
                    >
                      {t('dashboard')}
                    </Button>

                    <Button color="inherit" component={Link} to="/matches" startIcon={<Favorite />}>
                      {t('matches')}
                    </Button>
                  </>
                )}

                {/* --- איזור חדש למועמדים בלבד --- */}
                {!isShadchanOrAdmin && (
                   <Button 
                     component={Link} 
                     to="/my-proposals" 
                     startIcon={<Favorite />}
                     sx={{ fontWeight: 'bold', color: '#e91e63', border: '1px solid #e91e63', borderRadius: '20px' }}
                   >
                     ההצעות שלי
                   </Button>
                )}
              </>
            )}

            {!isAuthenticated && (
              <>
                <Button color="inherit" component={Link} to="/login" startIcon={<Login />}>{t('login')}</Button>
                <Button variant="outlined" component={Link} to="/register" startIcon={<HowToReg />}>{t('register')}</Button>
              </>
            )}
          </Box>

          {/* תפריט משתמש */}
          {isAuthenticated && (
            <Box sx={{ flexGrow: 0, ml: 2 }}>
              <Tooltip title={t('settings_tooltip')}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', fontWeight: 'bold' }}>
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <Person />}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #eee' }}>
                   <Typography variant="subtitle2" noWrap>
                    {t('hello')}, {user?.fullName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.role === 'shadchan' ? t('role_shadchan') : t('role_candidate')}
                  </Typography>
                </Box>

                <MenuItem component={Link} to="/create-profile" onClick={handleCloseUserMenu}>
                  <Person sx={{ ml: 1 }} /> {t('profile')}
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <Logout sx={{ ml: 1 }} /> {t('logout')}
                </MenuItem>
              </Menu>
            </Box>
          )}

        </Toolbar>
      </AppBar>

      <Container style={{ marginTop: '30px', paddingBottom: '50px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create-profile" element={<CreateProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/my-proposals" element={<MyProposalsPage />} /> {/* <-- הראוט החדש */}
        </Routes>
      </Container>
    </>
  );
}

export default App;