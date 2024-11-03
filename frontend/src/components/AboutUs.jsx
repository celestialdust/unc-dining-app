import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="lg">
        <Box sx={{ my: 8, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom>
            More About NutriTrack UNC
          </Typography>
          <Typography variant="h5" component="p" color="text.secondary" paragraph>
            Our Mission, Values, and Vision
          </Typography>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph>
            At NutriTrack UNC, our mission is to empower UNC students to make informed nutritional choices, 
            promoting healthier lifestyles through personalized tracking and insights.
          </Typography>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Our Values
          </Typography>
          <Typography variant="body1" paragraph>
            - Health-Focused: We prioritize the well-being of our users above all else.
          </Typography>
          <Typography variant="body1" paragraph>
            - Innovation: We continuously strive to improve our services and technology.
          </Typography>
          <Typography variant="body1" paragraph>
            - Inclusivity: We cater to diverse dietary needs and preferences.
          </Typography>
          <Typography variant="body1" paragraph>
            - Privacy: We respect and protect our users' data and information.
          </Typography>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Our Vision
          </Typography>
          <Typography variant="body1" paragraph>
            We envision a campus where every student has the tools and knowledge to maintain optimal nutrition, 
            supporting their academic success and overall well-being.
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="contained" color="primary" size="large" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
}