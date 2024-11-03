import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  useTheme,
  Button,
  CircularProgress,
} from '@mui/material';
import { LocalFireDepartment, Restaurant, Grain, OilBarrel } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useNavigate } from  'react-router-dom';
import meme from '../img/meme.jpg';

const NutritionOverview = ({ nutritionData }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Daily Nutrition Overview
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Box display="flex" alignItems="center">
            <LocalFireDepartment color="error" sx={{ mr: 1 }} />
            <Typography variant="body2">{nutritionData.calories} / {nutritionData.calorieGoal} kcal</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box display="flex" alignItems="center">
            <Restaurant color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2">{nutritionData.protein}g / {nutritionData.proteinGoal}g protein</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box display="flex" alignItems="center">
            <Grain color="warning" sx={{ mr: 1 }} />
            <Typography variant="body2">{nutritionData.carbs}g / {nutritionData.carbsGoal}g carbs</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box display="flex" alignItems="center">
            <OilBarrel color="info" sx={{ mr: 1 }} />
            <Typography variant="body2">{nutritionData.fat}g / {nutritionData.fatGoal}g fat</Typography>
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const ProgressChart = () => {
  const theme = useTheme();

  const dummyData = [
    { name: 'Mon', calories: 1800 },
    { name: 'Tue', calories: 1900 },
    { name: 'Wed', calories: 2000 },
    { name: 'Thu', calories: 1950 },
    { name: 'Fri', calories: 2100 },
    { name: 'Sat', calories: 1800 },
    { name: 'Sun', calories: 1900 },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Weekly Calorie Intake
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dummyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="calories" 
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const MealRecommendations = ({ recommendations }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Meal Recommendations
      </Typography>
      {recommendations.suggestedMeals.map((meal, index) => (
        <Typography key={index} variant="body2" paragraph>
          {index + 1}. {meal}
        </Typography>
      ))}
    </CardContent>
  </Card>
);

const DailyHealthMeme = () => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Daily Health Meme
      </Typography>
      <Box
        component="img"
        src= 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9GYi7DPWxXTfu6IW-wSRnvAQR63heb3h6wA&s'
        alt="Daily health meme"
        sx={{ width: '40%', height: 'auto', borderRadius: 1 }}
      />
      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', textAlign: 'center' }}>
        When you finally hit your protein goal for the day
      </Typography>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const userResponse = await axios.get('/api/user');
        setUserData(userResponse.data);

        const logsResponse = await axios.get('/api/nutrition/logs');
        setNutritionLogs(logsResponse.data);

        const recommendationsResponse = await axios.get('/api/recommendations');
        setRecommendations(recommendationsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.get('/api/auth/logout');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const nutritionData = {
    calories: 1800,
    calorieGoal: 2000,
    protein: 75,
    proteinGoal: 100,
    carbs: 200,
    carbsGoal: 250,
    fat: 50,
    fatGoal: 65,
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, {userData?.name || 'User'}
          </Typography>
          <Button variant="outlined" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <NutritionOverview nutritionData={nutritionData} />
          </Grid>
          <Grid item xs={12} md={8}>
            <ProgressChart nutritionLogs={nutritionLogs} />
          </Grid>
          <Grid item xs={12} md={4}>
            {recommendations && <MealRecommendations recommendations={recommendations} />}
          </Grid>
          <Grid item xs={12}>
            <DailyHealthMeme />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}