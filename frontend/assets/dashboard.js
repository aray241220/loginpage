const API_URL = 'http://localhost:5000';

// Check if user is logged in on page load
window.addEventListener('load', () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }
    
    // Load user data
    const userData = JSON.parse(localStorage.getItem('user_data'));
    if (userData) {
        document.getElementById('userName').textContent = userData.username;
        document.getElementById('userEmail').textContent = userData.email;
        document.getElementById('joinDate').textContent = new Date(userData.date_joined).toLocaleDateString();
    }
    
    // Fetch backend info using JWT authentication
    fetchBackendInfo();
});

async function fetchBackendInfo() {
    const token = localStorage.getItem('jwt_token');
    
    try {
        const response = await fetch(`${API_URL}/api/info`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.status === 401) {
            // Token expired or invalid - logout user
            handleLogout();
            return;
        }
        
        if (response.ok) {
            const data = await response.json();
            console.log('Backend Info (from JWT protected endpoint):', data);
        }
    } catch (error) {
        console.error('Error fetching backend info:', error);
    }
}

async function handleLogout() {
    const token = localStorage.getItem('jwt_token');
    
    try {
        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            // Clear localStorage
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('user_data');
            
            // Redirect to login
            window.location.href = 'index.html';
        } else {
            alert('Logout failed!');
        }
    } catch (error) {
        console.error('Error:', error);
        // Clear localStorage anyway and redirect
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_data');
        window.location.href = 'index.html';
    }
}
