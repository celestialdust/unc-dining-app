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
  Fab,
  TextField,
  Drawer,
} from '@mui/material';
import { LocalFireDepartment, Restaurant, Grain, OilBarrel, Send, Chat } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NutritionOverview = ({ nutritionData }) => {
  const theme = useTheme();
  return (
    <Card sx={{ backgroundColor: theme.palette.background.paper }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
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
              <Grain color="secondary" sx={{ mr: 1 }} />
              <Typography variant="body2">{nutritionData.carbs}g / {nutritionData.carbsGoal}g carbs</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box display="flex" alignItems="center">
              <OilBarrel color="warning" sx={{ mr: 1 }} />
              <Typography variant="body2">{nutritionData.fat}g / {nutritionData.fatGoal}g fat</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const ProgressChart = ({ nutritionLogs }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ backgroundColor: theme.palette.background.paper, height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          Weekly Calorie Intake
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={nutritionLogs}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="calories" 
              stroke={theme.palette.secondary.main}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const MealRecommendations = ({ recommendations }) => {
  const theme = useTheme();
  return (
    <Card sx={{ backgroundColor: theme.palette.background.paper }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
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
};

const DailyHealthMeme = () => {
  const theme = useTheme();
  return (
    <Card sx={{ backgroundColor: theme.palette.background.paper, height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          Daily Health Meme
        </Typography>
        <Box
          component="img"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9GYi7DPWxXTfu6IW-wSRnvAQR63heb3h6wA&s"
          alt="Daily health meme"
          sx={{ width: '40%', height: 'auto', borderRadius: 1 }}
        />
        <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', textAlign: 'center' }}>
          When you finally hit your protein goal for the day
        </Typography>
      </CardContent>
    </Card>
  );
};

const RecommendationSidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setConversation([...conversation, { type: 'user', text: message }]);
      // Simulated AI response
      setTimeout(() => {
        setConversation(prev => [...prev, { type: 'ai', text: `Here's a recommendation based on "${message}": Eat more vegetables!` }]);
      }, 1000);
      setMessage('');
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant="persistent"
      sx={{
        width: 300,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 300,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.default,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          AI Recommendations
        </Typography>
        <Box sx={{ height: 'calc(100vh - 200px)', overflowY: 'auto', mb: 2 }}>
          {conversation.map((msg, index) => (
            <Box key={index} sx={{ mb: 1, textAlign: msg.type === 'user' ? 'right' : 'left' }}>
              <Typography
                variant="body2"
                sx={{
                  display: 'inline-block',
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: msg.type === 'user' ? theme.palette.primary.light : theme.palette.secondary.light,
                }}
              >
                {msg.text}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex' }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask for advice..."
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            sx={{ ml: 1 }}
          >
            <Send />
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default function Dashboard() {
  const theme = useTheme();
  const [userData, setUserData] = useState(null);
  const [nutritionLogs, setNutritionLogs] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        flexGrow: 1, 
        backgroundColor: theme.palette.background.default,
        transition: 'margin 0.3s',
        marginRight: sidebarOpen ? '300px' : 0,
        position: 'relative',
      }}
    >
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            Welcome, {userData?.name || 'User'}
          </Typography>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <NutritionOverview nutritionData={{
              calories: 1800,
              calorieGoal: 2000,
              protein: 75,
              proteinGoal: 100,
              carbs: 200,
              carbsGoal: 250,
              fat: 50,
              fatGoal: 65,
            }} />
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
      <RecommendationSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box
        sx={{
          position: 'fixed',
          right: sidebarOpen ? 316 : 16,
          bottom: 16,
          transition: 'right 0.3s',
          zIndex: 1000,
        }}
      >
        <Fab
          color="secondary"
          aria-label="chat"
          onClick={toggleSidebar}
          sx={{
            transition: 'transform 0.3s',
            transform: sidebarOpen ? 'rotate(180deg)' : 'none',
          }}
        >
          <Chat />
        </Fab>
      </Box>
    </Box>
  );
}