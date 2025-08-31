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
  if (!localStorage.getItem('token')) {
    window.location.href = '/login';
  }
}

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  try {
    const response = await authRequest(`${API_BASE}/posts`, {
      method: 'POST',
      body: formData
    });
    
    if (response?.ok) {
      alert('Appointment booked successfully!');
      e.target.reset();
    } else {
      alert('Failed to book appointment');
    }
  } catch (error) {
    alert('An error occurred. Please try again.');
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  document.getElementById('review-form')?.addEventListener('submit', handleSubmit);
});