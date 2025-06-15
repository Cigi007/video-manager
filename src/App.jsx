import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Videos from './pages/Videos';
import Pages from './pages/Pages';
import Customization from './pages/Customization';
import Settings from './pages/Settings';
import PrivateRoute from './components/PrivateRoute';
import React, { createContext, useState, useEffect } from 'react';
import { mockPages, mockAllVideos } from './mockData';

export const AppDataContext = createContext();

function getInitialPages() {
  const stored = localStorage.getItem('pages');
  return stored ? JSON.parse(stored) : [...mockPages];
}
function getInitialVideos() {
  const stored = localStorage.getItem('videos');
  return stored ? JSON.parse(stored) : [...mockAllVideos];
}

function AppDataProvider({ children }) {
  const [pages, setPages] = useState(getInitialPages());
  const [videos, setVideos] = useState(getInitialVideos());

  useEffect(() => {
    localStorage.setItem('pages', JSON.stringify(pages));
  }, [pages]);
  useEffect(() => {
    localStorage.setItem('videos', JSON.stringify(videos));
  }, [videos]);

  return (
    <AppDataContext.Provider value={{ pages, setPages, videos, setVideos }}>
      {children}
    </AppDataContext.Provider>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppDataProvider>
        <Routes>
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route element={<Layout />}>
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/videos" element={<PrivateRoute><Videos /></PrivateRoute>} />
            <Route path="/pages" element={<PrivateRoute><Pages /></PrivateRoute>} />
            <Route path="/customization" element={<PrivateRoute><Customization /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          </Route>
        </Routes>
      </AppDataProvider>
    </ThemeProvider>
  );
}

export default App;
