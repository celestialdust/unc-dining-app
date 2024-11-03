import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './Homepage';
import Dashboard from './Dashboard';
import UserPreferencesForm from './UserPreferencesForm';
import AboutUs from './AboutUs';

const theme = createTheme({
  palette: {
    primary: {
      main: '#D2691E', // Chocolate
      light: '#FFDAB9', // Peach Puff
      dark: '#8B4513', // Saddle Brown
    },
    secondary: {
      main: '#FFA500', // Orange
      light: '#FFD700', // Gold
      dark: '#FF8C00', // Dark Orange
    },
    background: {
      default: '#FFF8DC', // Cornsilk
      paper: '#FFFAF0', // Floral White
    },
    text: {
      primary: '#4A4A4A', // Dark Gray
      secondary: '#6B6B6B', // Medium Gray
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/preferences-form" element={<UserPreferencesForm />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;