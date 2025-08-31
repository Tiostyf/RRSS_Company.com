// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');
  if (token && (window.location.pathname.endsWith('login.html') || 
                window.location.pathname.endsWith('register.html') ||
                window.location.pathname === '/')) {
    window.location.href = '/home';
  }
});

// Handle registration form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate form
    if (password !== confirmPassword) {
      showAlert('Passwords do not match', 'error');
      return;
    }
    
    if (password.length < 6) {
      showAlert('Password must be at least 6 characters', 'error');
      return;
    }
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Save token and redirect
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/home';
      } else {
        showAlert(data.message, 'error');
      }
    } catch (error) {
      showAlert('An error occurred. Please try again.', 'error');
    }
  });
}

// Handle login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Save token and redirect
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/home';
      } else {
        showAlert(data.message, 'error');
      }
    } catch (error) {
      showAlert('An error occurred. Please try again.', 'error');
    }
  });
}

// Show alert message
function showAlert(message, type) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.appendChild(document.createTextNode(message));
  
  // Insert after the form title or at the top of the form
  const form = document.querySelector('.auth-form');
  form.insertBefore(alertDiv, form.firstChild);
  
  // Remove alert after 3 seconds
  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}
