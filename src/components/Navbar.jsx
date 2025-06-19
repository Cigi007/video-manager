import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { AppDataContext } from '../App';

function Navbar() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const navigate = useNavigate();
  const { setAlert } = useContext(AppDataContext);

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
    setAlert({ message: 'Byli jste odhlášeni.', type: 'info' });
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>Videomanažer</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button color="inherit" onClick={() => navigate('/')}>Videa</Button>
        <Button color="inherit" onClick={() => navigate('/pages')}>Stránky</Button>
        {isAuthenticated ? (
          <Button color="inherit" onClick={handleLogout}>Odhlásit se</Button>
        ) : (
          <Button color="inherit" onClick={() => loginWithRedirect()}>Přihlásit se</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 