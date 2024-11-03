-- Drop existing views first (because they depend on the tables)
DROP VIEW IF EXISTS nutrition_logs_with_totals CASCADE;
DROP VIEW IF EXISTS daily_nutrition_totals CASCADE;

-- Drop existing tables (in correct order due to dependencies)
DROP TABLE IF EXISTS nutrition_logs CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS calculate_nutrition_totals CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    height FLOAT,
    weight FLOAT,
    age INTEGER,
    dietary_restrictions TEXT[], 
    nutrition_goals VARCHAR(255),
    activity_level INTEGER CHECK (activity_level BETWEEN 1 AND 5),
    has_completed_form BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create menu items table
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    dining_hall VARCHAR(255) NOT NULL,
    calories INTEGER NOT NULL,
    protein FLOAT NOT NULL,
    fat FLOAT NOT NULL,
    carbs FLOAT NOT NULL,
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create nutrition logs table
CREATE TABLE nutrition_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_type VARCHAR(50) NOT NULL,
    menu_item_id INTEGER REFERENCES menu_items(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indices
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_nutrition_logs_user_date ON nutrition_logs(user_id, date);
CREATE INDEX idx_menu_items_name ON menu_items(name);

-- Create view for nutrition totals
CREATE VIEW daily_nutrition_totals AS
SELECT 
    nl.user_id,
    nl.date,
    SUM(mi.calories * nl.quantity) as total_calories,
    SUM(mi.protein * nl.quantity) as total_protein,
    SUM(mi.fat * nl.quantity) as total_fat,
    SUM(mi.carbs * nl.quantity) as total_carbs
FROM 
    nutrition_logs nl
    JOIN menu_items mi ON nl.menu_item_id = mi.id
GROUP BY 
    nl.user_id, nl.date;