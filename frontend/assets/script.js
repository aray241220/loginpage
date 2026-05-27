const API_URL = 'https://loginpage-three-liard.vercel.app';

function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    loginForm.classList.toggle('active');
    registerForm.classList.toggle('active');
    
    // Clear messages
    document.getElementById('loginMessage').innerHTML = '';
    document.getElementById('registerMessage').innerHTML = '';
}

async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    const messageDiv = document.getElementById('registerMessage');
    
    if (password !== confirmPassword) {
        showMessage(messageDiv, 'Passwords do not match!', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage(messageDiv, 'Registration successful! Switching to login...', 'success');
            document.querySelector('#registerForm form').reset();
            // Clear form inputs
            document.getElementById('registerUsername').value = '';
            document.getElementById('registerEmail').value = '';
            document.getElementById('registerPassword').value = '';
            document.getElementById('registerConfirmPassword').value = '';
            // Switch to login form after 1.5 seconds
            setTimeout(() => {
                // Ensure we're on login form
                const loginForm = document.getElementById('loginForm');
                const registerForm = document.getElementById('registerForm');
                if (!loginForm.classList.contains('active')) {
                    toggleForms();
                }
                // Clear any messages
                document.getElementById('registerMessage').innerHTML = '';
            }, 1500);
        } else {
            showMessage(messageDiv, data.message || 'Registration failed!', 'error');
        }
    } catch (error) {
        showMessage(messageDiv, 'Error: ' + error.message, 'error');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageDiv = document.getElementById('loginMessage');
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store token in localStorage
            localStorage.setItem('jwt_token', data.token);
            localStorage.setItem('user_data', JSON.stringify(data.user));
            showMessage(messageDiv, 'Login successful!', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showMessage(messageDiv, data.message || 'Login failed!', 'error');
        }
    } catch (error) {
        showMessage(messageDiv, 'Error: ' + error.message, 'error');
    }
}

function showMessage(element, message, type) {
    element.innerHTML = message;
    element.className = `message ${type}`;
}
