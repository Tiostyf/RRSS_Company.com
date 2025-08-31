const API_BASE = '/api';

// Helper function for authenticated requests
async function authRequest(url, options = {}) {
  const token = localStorage.getItem('token');
  if (token) {
    options.headers = {...options.headers, 'Authorization': `Bearer ${token}`};
  }
  
  const response = await fetch(url, options);
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    return null;
  }
  return response;
}

// Check authentication
function checkAuth() {
  const token = localStorage.getItem('token');
  const path = window.location.pathname;
  
  if (token && (path.includes('login.html') || path.includes('register.html'))) {
    window.location.href = '/home';
  } else if (!token && !path.includes('login.html') && !path.includes('register.html')) {
    window.location.href = '/login';
  }
}

// Register function
async function register(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  try {
    const response = await authRequest(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      const {token} = await response.json();
      localStorage.setItem('token', token);
      window.location.href = '/home';
    } else {
      const {message} = await response.json();
      alert(message || 'Registration failed');
    }
  } catch (error) {
    alert('An error occurred. Please try again.');
  }
}

// Login function
async function login(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  try {
    const response = await authRequest(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      const {token} = await response.json();
      localStorage.setItem('token', token);
      window.location.href = '/home';
    } else {
      const {message} = await response.json();
      alert(message || 'Login failed');
    }
  } catch (error) {
    alert('An error occurred. Please try again.');
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  document.getElementById('register-form')?.addEventListener('submit', register);
  document.getElementById('login-form')?.addEventListener('submit', login);
});