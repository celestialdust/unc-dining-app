# NutriTrack UNC - Smart Dining Hall Nutrition Tracker

## Overview
NutriTrack UNC is an intelligent nutrition tracking system designed specifically for UNC dining halls, helping students make informed dietary choices through personalized meal recommendations. Built during HackNC 2024, this project leverages advanced AI technology to provide customized meal planning while considering individual dietary preferences and restrictions.

## Features
- **Smart Meal Recommendations**: Multi-agent AI system that provides personalized meal suggestions based on:
  - Individual dietary restrictions and preferences
  - Nutritional goals
  - Available menu items in UNC dining halls
  
- **Personalized Dashboard**
  - Real-time nutrition tracking
  - Weekly progress visualization
  - Daily calorie and macro monitoring
  - Interactive meal planning interface

- **AI-Powered Chat Assistant**
  - Real-time dietary advice
  - Meal suggestions
  - Nutritional information
  - Health tips

- **User Authentication**
  - Secure Google OAuth integration
  - Personalized user profiles
  - Preference management

## Tech Stack
### Frontend
- React.js
- Material-UI
- Recharts for data visualization
- Axios for API communication

### Backend
- Node.js/Express for main API
- Flask for AI service
- CrewAI for multi-agent recommendation system
- PostgreSQL for data persistence

## System Architecture
```
├── Frontend (React)
│   ├── User Interface
│   ├── Dashboard
│   └── Real-time Updates
│
├── Main Backend (Node.js)
│   ├── Authentication
│   ├── User Management
│   └── Data Processing
│
├── AI Service (Flask)
│   ├── CrewAI Integration
│   ├── Meal Analysis
│   └── Recommendations
│
└── Database (PostgreSQL)
    ├── User Profiles
    ├── Nutrition Logs
    └── Menu Items
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8+
- PostgreSQL
- Google OAuth credentials

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/nutritrack-unc.git
cd nutritrack-unc
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd ../backend
npm install
```

4. Set up Python environment and install AI service dependencies
```bash
cd ../python-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

5. Set up environment variables
```bash
# Frontend (.env)
REACT_APP_API_URL=http://localhost:3000

# Backend (.env)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
SESSION_SECRET=your_session_secret
POSTGRES_DB=nutritrack
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
```

6. Initialize the database
```bash
cd backend
npm run db:init
```

### Running the Application

1. Start the frontend
```bash
cd frontend
npm start
```

2. Start the main backend
```bash
cd backend
npm start
```

3. Start the AI service
```bash
cd python-service
python app.py
```

## Features in Detail

### User Flow
1. Login with Google account
2. Complete initial dietary preferences form
3. Access personalized dashboard
4. Receive AI-powered meal recommendations
5. Track nutrition goals and progress

### AI Recommendation System
- Utilizes multiple specialized agents:
  - Data Collection Agent
  - Nutrition Analysis Agent
  - Menu Recommendation Agent
- Considers:
  - User dietary restrictions
  - Nutritional goals
  - Available menu items
  - Historical preferences

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments
- HackNC 2024 organizers and mentors
- UNC Dining Services for data support
- CrewAI documentation and community

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
