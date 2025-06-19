import React, { createContext, useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Snackbar, Alert } from '@mui/material';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

import Navbar from './components/Navbar';
import Layout from './components/Layout';
import Login from './pages/Login';
import Videos from './pages/Videos';
import Pages from './pages/Pages';
import Dashboard from './pages/Dashboard';
import Customization from './pages/Customization';
import Settings from './pages/Settings';

export const AppDataContext = createContext();

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#1a2027',
      paper: '#2a333d',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a2027',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#2a333d',
        },
      },
    },
  },
});

function AppContent() {
  const [videos, setVideos] = useState([]);
  const [pages, setPages] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: '', type: 'success' });
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  const fetchPages = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_URL}/api/pages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error("Error fetching pages:", error);
      setAlert({ message: `Chyba při načítání stránek: ${error.message}`, type: "error" });
    }
  }, [isAuthenticated, getAccessTokenSilently, API_URL, setPages, setAlert]);

  const fetchVideos = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_URL}/api/videos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setAlert({ message: `Chyba při načítání videí: ${error.message}`, type: "error" });
    }
  }, [isAuthenticated, getAccessTokenSilently, setAlert, API_URL]);

  useEffect(() => {
    fetchPages();
    fetchVideos();
  }, [fetchPages, fetchVideos]);

  if (isLoading) {
    return <div>Načítání aplikace...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppDataContext.Provider value={{ videos, setVideos, pages, setPages, setAlert }}>
        <Navbar />
        <Routes>
          {isAuthenticated ? (
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/videos" replace />} />
              <Route path="videos" element={<Videos />} />
              <Route path="pages" element={<Pages />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="customization" element={<Customization />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/videos" replace />} />
            </Route>
          ) : (
            <Route path="/login" element={<Login />} />
          )}
          <Route path="*" element={isAuthenticated ? <Navigate to="/videos" replace /> : <Navigate to="/login" replace />} />
        </Routes>
        <Snackbar 
          open={alert.open} 
          autoHideDuration={6000} 
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseAlert} severity={alert.type} sx={{ width: '100%' }}>
            {alert.message}
          </Alert>
        </Snackbar>
      </AppDataContext.Provider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Auth0Provider
      domain="dev-1mrqpn0f27g3by3r.us.auth0.com"
      clientId="diy1GzkNrbSpZSUOyrU1J0b0jkMkRqsi"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://dev-1mrqpn0f27g3by3r.us.auth0.com/api/v2/",
        scope: "openid profile email"
      }}
    >
      <AppContent />
    </Auth0Provider>
  );
}

export default App;
