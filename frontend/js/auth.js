const API_BASE = '/api';

// Check if user is logged in
function checkAuth() {
  const token = localStorage.getItem('token');
  if (token && (window.location.pathname.includes('login.html') || 
      window.location.pathname.includes('register.html'))) {
    window.location.href = '/home';
  } else if (!token && !window.location.pathname.includes('login.html') && 
             !window.location.pathname.includes('register.html')) {
    window.location.href = '/login';
  }
}

// Register function
async function register(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = '/home';
    } else {
      showAlert(data.message || data.error, 'error');
    }
  } catch (error) {
    showAlert('An error occurred. Please try again.', 'error');
  }
}

// Login function
async function login(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = '/home';
    } else {
      showAlert(data.message || data.error, 'error');
    }
  } catch (error) {
    showAlert('An error occurred. Please try again.', 'error');
  }
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}

// Show alert message
function showAlert(message, type) {
  // Remove any existing alerts
  const existingAlerts = document.querySelectorAll('.alert');
  existingAlerts.forEach(alert => alert.remove());
  
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.appendChild(document.createTextNode(message));
  
  // Try different container selectors based on page
  let container = document.querySelector('.auth-container') || 
                  document.querySelector('.form-container') ||
                  document.querySelector('.container') ||
                  document.querySelector('body');
  
  if (container) {
    const form = document.querySelector('form');
    if (form) {
      container.insertBefore(alertDiv, form);
    } else {
      container.insertBefore(alertDiv, container.firstChild);
    }
  }
  
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.parentNode.removeChild(alertDiv);
    }
  }, 5000);
}

// Initialize auth pages
if (document.getElementById('register-form')) {
  document.getElementById('register-form').addEventListener('submit', register);
}

if (document.getElementById('login-form')) {
  document.getElementById('login-form').addEventListener('submit', login);
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', checkAuth);