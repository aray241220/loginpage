# Simple Login System - README

## Project Structure
```
simple login/
├── frontend/
│   ├── index.html              # Login & Registration page
│   ├── dashboard.html          # Dashboard after successful login
│   └── assets/
│       ├── style.css           # Minimalistic styling
│       ├── script.js           # Login/Register logic
│       └── dashboard.js        # Dashboard logic
├── backend/
│   ├── app.py                  # Flask application
│   ├── requirements.txt        # Python dependencies
│   └── users.json              # User data storage (auto-created)
└── projectprompt.txt
```

## Features

### Frontend
- **Login Page**: Email and password authentication
- **Registration Page**: New user registration with confirmation password
- **Auto Redirect**: After registration, automatically switches to login page
- **Dashboard**: Shows user info after successful login
- **Logout Button**: Located in the top right corner
- **Minimalistic Design**: Clean and simple UI
- **JWT Validation**: Fetches backend data using JWT authentication

### Backend
- **User Registration**: Stores username, email, password hash, and date joined
- **JWT Authentication**: Uses JWT tokens for stateless authentication
- **JWT-Protected GET API**: `/api/info` endpoint returns backend information (requires valid JWT)
- **User Profile Endpoint**: `/user/profile` GET endpoint for authenticated user info
- **Auto Logout**: Tokens expire after 1 hour
- **Password Security**: Passwords are hashed using Werkzeug security
- **CORS Support**: Allows frontend-backend communication

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the Flask app:
```bash
python app.py
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Open `index.html` in your browser or use a live server:
```bash
# Using Python's built-in server
python -m http.server 8000
```

Then visit `http://localhost:8000`

## API Endpoints

### POST `/register`
Register a new user
```json
{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
}
```
**Response**: Registration successful message. User is then automatically switched to login page.

### POST `/login`
Login user and get JWT token
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

Response:
```json
{
    "message": "Login successful",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
        "username": "john_doe",
        "email": "john@example.com",
        "date_joined": "2024-01-15T10:30:00"
    }
}
```

### GET `/api/info` (JWT Protected)
Fetch backend information - requires valid JWT token
```
Header: Authorization: Bearer <JWT_TOKEN>
```

Response:
```json
{
    "backend_name": "Simple Login System",
    "version": "1.0.0",
    "features": [
        "User Registration",
        "JWT Authentication",
        "Secure Password Hashing",
        "Token Expiration (1 hour)",
        "User Dashboard"
    ],
    "authenticated_user": "user@example.com",
    "message": "This is a protected endpoint accessible only with valid JWT"
}
```

### GET `/user/profile` (JWT Protected)
Get current user profile - requires valid JWT token
```
Header: Authorization: Bearer <JWT_TOKEN>
```

Response:
```json
{
    "username": "john_doe",
    "email": "john@example.com",
    "date_joined": "2024-01-15T10:30:00",
    "message": "User profile retrieved successfully"
}
```

### POST `/logout`
Logout user (requires valid JWT token in Authorization header)

### GET `/protected`
Generic protected route that requires JWT token

## Usage Flow

1. **Register**: New users fill in the registration form with username, email, and password
2. **Login**: Users enter email and password to login
3. **Dashboard**: After successful login, users are redirected to the dashboard showing:
   - Welcome message
   - Username
   - Email
   - Date of joining
4. **Logout**: Click the logout button in the top right to logout and return to login page

## Token Expiration

- JWT tokens expire after **1 hour**
- When a token expires, the user will be automatically logged out on their next request
- Users need to login again after token expiration

## Security Notes

- Change the `JWT_SECRET_KEY` in `app.py` before deploying to production
- Use environment variables for sensitive configuration
- Enable HTTPS for production deployments
- Consider using a database like SQLite or PostgreSQL instead of JSON file for production

## Browser Storage

- JWT token is stored in `localStorage` as `jwt_token`
- User data is stored in `localStorage` as `user_data`
- Both are cleared on logout
