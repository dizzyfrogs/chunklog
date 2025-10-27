# ChunkLog

A modern, full-stack nutrition and fitness tracking application with a beautiful Material-UI interface, featuring light/dark mode and integration with USDA FoodData Central database.

## Table of Contents

- [Features](#features)
  - [Dashboard](#dashboard)
  - [Food Logging](#food-logging)
  - [Weight Tracking](#weight-tracking)
  - [Goals & Profile](#goals--profile)
  - [Modern UI](#modern-ui)
  - [Authentication](#authentication)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Getting Started](#getting-started)
  - [Logging Food](#logging-food)
  - [Logging Weight](#logging-weight)
  - [Viewing History](#viewing-history)
- [Production Deployment](#production-deployment)
- [Security Notes](#security-notes)
- [License](#license)
- [Contributing](#contributing)
- [Support](#support)

## Features

### Dashboard
- Real-time daily calorie and macro tracking
- Visual progress indicators with circular progress
- Quick view of protein, carbs, and fat intake
- Color-coded thresholds for goal tracking

### Food Logging
- **USDA Database Integration**: Search from thousands of foods in the USDA FoodData Central database
- Personal food library for your custom entries
- Edit nutritional values before logging
- Quick-add functionality with customizable servings
- Historical food log viewing with date navigation
- Delete and manage logged entries

### Weight Tracking
- Log weight in pounds or kilograms
- Visual progress chart using Chart.js
- Historical weight data viewing
- Full history with date filters
- Delete and manage weight entries

### Goals & Profile
- **Automatic Goal Calculation**: Based on your weight logs and goal type
  - Weight Loss (~1 lb/week)
  - Muscle Growth (Lean Bulk)
  - Weight Maintenance
- **Manual Goal Setting**: Set custom calorie and macro targets
- Complete user profile with:
  - Date of birth, gender, height
  - Activity level tracking
  - Height measurement in ft/in or cm

### Modern UI
- **Material-UI Components**: Beautiful, responsive design
- **Light/Dark Mode**: Seamless theme switching
- **Gradient Accents**: Modern, polished aesthetic
- **Floating Navigation**: Glassmorphism design
- **Progressive Web App**: Add to homescreen on mobile devices
- **Safe Area Support**: Works perfectly with device notches and home indicators

### Authentication
- Secure JWT-based authentication
- Automatic token refresh
- User registration and login
- Protected routes and endpoints

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Lightweight database
- **httpx** - Async HTTP client for USDA API
- **python-jose** - JWT authentication
- **bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **Chart.js** - Weight progress charts
- **react-toastify** - Toast notifications
- **Axios** - HTTP client

### External APIs
- **USDA FoodData Central API** - Food nutrition database

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- USDA FoodData Central API key (free) from [fdc.nal.usda.gov](https://fdc.nal.usda.gov/api-guide.html)

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chunklog.git
cd chunklog
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

3. Install backend dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables in `/.env`:
```env
USDA_API_KEY=your_usda_api_key_here
SECRET_KEY=your_secret_key_here
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

5. Start the backend server:
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults to localhost):
```env
VITE_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Configuration

### Backend Environment Variables

- `USDA_API_KEY`: Your USDA FoodData Central API key (required for food search)
- `SECRET_KEY`: Secret key for JWT token signing
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS

### Frontend Environment Variables

- `VITE_API_URL`: Backend API URL (default: `http://127.0.0.1:8000`)

## Usage

### Getting Started

1. **Create an Account**: Click "Sign Up" on the login page
2. **Complete Your Profile**: Fill in date of birth, gender, height, and activity level
3. **Set Your Goals**: Choose automatic goal calculation or set manual targets
4. **Start Logging**: Log your meals and weight to track your progress

### Logging Food

1. Click the "Log Meal" button on the dashboard or navigate to the Food page
2. Search for foods in the USDA database or your personal library
3. Select a food from the search results
4. Optionally edit nutritional values
5. Choose whether to save to your library (for USDA foods)
6. Set servings and log the food

### Logging Weight

1. Click the "Log Weight" button on the dashboard or navigate to Weight page
2. Enter your weight and select lbs or kg
3. Choose the date (defaults to today)
4. Log your weight

### Viewing History

- Navigate to the Food or Weight page
- Use date navigation to view past entries
- Delete entries by clicking the delete button

## Production Deployment

### Backend

1. Use a production ASGI server:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Or with Gunicorn:
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

2. Update `ALLOWED_ORIGINS` in `.env` to include your production frontend URL

### Frontend

1. Build for production:
```bash
npm run build
```

2. Serve the `dist` folder with a web server (nginx, Apache, etc.)

3. For deployment platforms like Vercel or Netlify:
- Vercel: Connect your GitHub repo and deploy
- Netlify: Build command: `npm run build`, Publish directory: `dist`

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Token refresh mechanism prevents frequent re-logins
- CORS is configured to restrict origins
- SQL injection prevented by SQLAlchemy ORM

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and feature requests, please open an issue on GitHub.

---

Built with ❤️