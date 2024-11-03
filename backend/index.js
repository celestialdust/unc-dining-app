require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const cors = require('cors');

const app = express();

// Database connection pool
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'localhost',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

// Middleware
app.use(express.json());
app.use(cors({ 
  origin: 'http://localhost:3001', // Change this to your React port
  credentials: true 
}));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const executeQuery = async (query, params = []) => {
  try {
    const result = await pool.query(query, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database operation failed');
  }
};

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists
    const userResult = await executeQuery('SELECT * FROM users WHERE google_id = $1', [profile.id]);
    let user = userResult.rows[0];
    
    if (!user) {
      // Create new user
      const newUserResult = await executeQuery(
        'INSERT INTO users (google_id, email, name, has_completed_form) VALUES ($1, $2, $3, $4) RETURNING *',
        [profile.id, profile.emails[0].value, profile.displayName, false]
      );
      user = newUserResult.rows[0];
    }
    
    return done(null, user);
  } catch (error) {
    console.error('Authentication error:', error);
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error);
  }
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};

app.get('/auth/google', (req, res, next) => {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })(req, res, next);
});

app.get('/auth/google/callback',
  (req, res, next) => {
    passport.authenticate('google', {
      failureRedirect: 'http://localhost:3001/?error=auth_failed'
    })(req, res, next);
  },
  async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect('http://localhost:3001/?error=no_user');
      }

      const result = await executeQuery(
        'SELECT has_completed_form FROM users WHERE id = $1',
        [req.user.id]
      );
      
      const hasCompletedForm = result.rows[0].has_completed_form;
      
      if (!hasCompletedForm) {
        res.redirect('http://localhost:3001/preferences-form');
      } else {
        res.redirect('http://localhost:3001/dashboard');
      }
    } catch (error) {
      console.error('Callback error:', error);
      res.redirect('http://localhost:3001/');
    }
  }
);

// User preferences
app.post('/api/preferences', isAuthenticated, async (req, res) => {
  try {
    const { height, weight, age, dietaryRestrictions, nutritionGoals, activityLevel } = req.body;
    await pool.query(
      'UPDATE users SET height = $1, weight = $2, age = $3, dietary_restrictions = $4, nutrition_goals = $5, activity_level = $6, has_completed_form = true WHERE id = $7',
      [height, weight, age, dietaryRestrictions, nutritionGoals, activityLevel, req.user.id]
    );
    res.json({ message: 'Preferences updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating preferences' });
  }
});

// Get user data
app.get('/api/user', isAuthenticated, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, name, height, weight, age, dietary_restrictions, nutrition_goals, activity_level, has_completed_form FROM users WHERE id = $1', [req.user.id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
});


// Get user preferences
app.get('/api/preferences', isAuthenticated, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT height, weight, age, dietary_restrictions, nutrition_goals, activity_level FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user preferences' });
  }
});

// Add a new nutrition log
app.post('/api/nutrition/log', isAuthenticated, async (req, res) => {
  try {
    const { date, items } = req.body;
    await pool.query(
      'INSERT INTO nutrition_logs (user_id, date, items) VALUES ($1, $2, $3)',
      [req.user.id, date, JSON.stringify(items)]
    );
    res.status(201).json({ message: 'Nutrition log added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding nutrition log' });
  }
});

// Get nutrition logs for a specific date range
app.get('/api/nutrition/logs', isAuthenticated, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let result;

    if (startDate && endDate) {
      result = await pool.query(
        'SELECT * FROM nutrition_logs_with_totals WHERE user_id = $1 AND date BETWEEN $2 AND $3 ORDER BY date ASC',
        [req.user.id, startDate, endDate]
      );
    } else {
      // Generate dummy data for the last 7 days
      const dummyData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dummyData.push({
          date: date.toISOString().split('T')[0],
          calories: Math.floor(Math.random() * 500) + 1500,
        });
      }
      result = { rows: dummyData };
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching nutrition logs:', error);
    res.status(500).json({ error: 'Error fetching nutrition logs' });
  }
});

// Update user profile
app.put('/api/user/profile', isAuthenticated, async (req, res) => {
  try {
    const { name, email } = req.body;
    await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3',
      [name, email, req.user.id]
    );
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user profile' });
  }
});


// Recommendation system (placeholder)
app.get('/api/recommendations', isAuthenticated, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = result.rows[0];
    const recommendation = {
      message: 'Based on your preferences and goals, we recommend increasing your protein intake and reducing carbohydrates.',
      suggestedMeals: [
        'Grilled chicken salad',
        'Salmon with roasted vegetables',
        'Greek yogurt with berries and nuts',
      ],
    };
    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ error: 'Error generating recommendations' });
  }
});

// Logout route
app.get('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error logging out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Add a new route to fetch menu items
app.get('/api/menu-items', isAuthenticated, async (req, res) => {
  try {
    const { diningHall, search } = req.query;
    let query = 'SELECT * FROM menu_items WHERE 1=1';
    const queryParams = [];

    if (diningHall) {
      queryParams.push(diningHall);
      query += ` AND dining_hall = $${queryParams.length}`;
    }

    if (search) {
      queryParams.push(`%${search}%`);
      query += ` AND name ILIKE $${queryParams.length}`;
    }

    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching menu items' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).redirect('http://localhost:3001/');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});