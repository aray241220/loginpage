from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import json
import os

app = Flask(__name__)
CORS(app)

# Configure JWT
app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-this-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
jwt = JWTManager(app)

# Data file for storing users
USERS_FILE = 'users.json'

## IN MEMORY DB
users_db = {
    "1": {
        "username": "rayadrija",
        "email": "rayadrija2003@gmail.com",
        "password": "pbkdf2:sha256:600000$aUzL2NFVHqua9BeL$1c79b910f1f6a33bb20c439154b3e6badb6be4eb03cb501f26e41b231333d8cc",
        "date_joined": "2026-05-24T00:26:37.197319"
    },
    "2": {
        "username": "rupsaroy",
        "email": "test@xyz",
        "password": "pbkdf2:sha256:600000$H4b6tPV9AyoGLvYX$205733560e88a2e895935c66b26be6f4c48a41bf74da8a872928585517ea03a6",
        "date_joined": "2026-05-24T01:52:59.188873"
    }
}


def load_users():
    """Load users from JSON file"""
    # if os.path.exists(USERS_FILE):
    #     with open(USERS_FILE, 'r') as f:
    #         return json.load(f)
    # return {}
    return users_db

def save_users(users):
    """Save users in memory"""
    global users_db
    users_db = users

@app.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    users = load_users()
    
    # Check if user already exists
    if any(user['email'] == data['email'] for user in users.values()):
        return jsonify({'message': 'Email already registered'}), 400
    
    if any(user['username'] == data['username'] for user in users.values()):
        return jsonify({'message': 'Username already taken'}), 400
    
    # Create new user
    user_id = str(len(users) + 1)
    users[user_id] = {
        'username': data['username'],
        'email': data['email'],
        'password': generate_password_hash(data['password']),
        'date_joined': datetime.now().isoformat()
    }
    
    save_users(users)
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    """Login user and return JWT token"""
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
    
    users = load_users()
    
    # Find user by email
    user = None
    for user_id, u in users.items():
        if u['email'] == data['email']:
            user = u
            break
    
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'message': 'Invalid email or password'}), 401
    
    # Create JWT token
    access_token = create_access_token(identity=data['email'])
    
    return jsonify({
        'message': 'Login successful',
        'token': access_token,
        'user': {
            'username': user['username'],
            'email': user['email'],
            'date_joined': user['date_joined']
        }
    }), 200

@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user"""
    # JWT is stateless, so logout just needs to be acknowledged
    # Token will expire after the configured time
    return jsonify({'message': 'Logout successful'}), 200

@app.route('/api/info', methods=['GET'])
@jwt_required()
def get_backend_info():
    """Get backend information (authenticated endpoint)"""
    current_user = get_jwt_identity()
    return jsonify({
        'backend_name': 'Simple Login System',
        'version': '1.0.0',
        'features': [
            'User Registration',
            'JWT Authentication',
            'Secure Password Hashing',
            'Token Expiration (1 hour)',
            'User Dashboard'
        ],
        'authenticated_user': current_user,
        'message': 'This is a protected endpoint accessible only with valid JWT'
    }), 200

@app.route('/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    """Get current user profile (authenticated endpoint)"""
    current_user = get_jwt_identity()
    users = load_users()
    
    # Find user by email
    user = None
    for user_id, u in users.items():
        if u['email'] == current_user:
            user = u
            break
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    return jsonify({
        'username': user['username'],
        'email': user['email'],
        'date_joined': user['date_joined'],
        'message': 'User profile retrieved successfully'
    }), 200

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    """Protected route - requires valid JWT"""
    current_user = get_jwt_identity()
    return jsonify({'message': f'Hello {current_user}!'}), 200

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'message': 'Server is running'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
