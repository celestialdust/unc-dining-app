import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { Restaurant, TrendingUp, EmojiEvents } from '@mui/icons-material';

const FeatureCard = ({ title, description, icon }) => (
  <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
      <Box sx={{ mb: 2 }}>
        {icon}
      </Box>
      <Typography variant="h6" component="h3" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

export default function HomePage() {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLogin = () => {
    window.location.href = '/auth/google';
  };
  
  const handleSignUp = () => {
    window.location.href = '/auth/google';
  };

  const handleLearnMore = () => {
    navigate('/about');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            NutriTrack UNC
          </Typography>
          <Button color="inherit" onClick={handleLogin}>Log In</Button>
          <Button variant="contained" color="primary" sx={{ ml: 2 }} onClick={handleSignUp}>
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box sx={{ my: 8, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Track Your Nutrition, Optimize Your Health
          </Typography>
          <Typography variant="h5" component="p" color="text.secondary" paragraph>
            Personalized nutrition tracking for UNC dining halls
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button variant="contained" color="primary" size="large" sx={{ mr: 2 }} onClick={handleSignUp}>
              Get Started
            </Button>
            <Button variant="outlined" color="primary" size="large" onClick={handleLearnMore}>
              Learn More
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} sm={4}>
            <FeatureCard
              title="Smart Tracking"
              description="Effortlessly log your meals from UNC dining halls"
              icon={<Restaurant fontSize="large" color="primary" />}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FeatureCard
              title="Personalized Insights"
              description="Get tailored nutrition recommendations"
              icon={<TrendingUp fontSize="large" color="primary" />}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FeatureCard
              title="Health Goals"
              description="Set and achieve your nutrition objectives"
              icon={<EmojiEvents fontSize="large" color="primary" />}
            />
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to optimize your nutrition?
          </Typography>
          <Button variant="contained" color="primary" size="large" onClick={handleSignUp}>
            Create Your Account
          </Button>
        </Box>
      </Container>

      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          © 2024 NutriTrack UNC. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}