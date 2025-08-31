const API_BASE = '/api';

// Check authentication
function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }
}

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('image', document.getElementById('image').files[0]);
  formData.append('description', document.getElementById('description').value);
  formData.append('review', document.getElementById('review').value);
  formData.append('appointmentDate', document.getElementById('appointment-date').value);
  formData.append('department', document.getElementById('department').value);
  formData.append('doctorName', document.getElementById('doctor-name').value);
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (response.ok) {
      showAlert('Appointment booked successfully!', 'success');
      document.getElementById('review-form').reset();
    } else {
      showAlert(data.message, 'error');
    }
  } catch (error) {
    showAlert('An error occurred. Please try again.', 'error');
  }
}

// Show alert message
function showAlert(message, type) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.appendChild(document.createTextNode(message));
  
  const formContainer = document.querySelector('.form-container');
  const form = document.querySelector('form');
  formContainer.insertBefore(alertDiv, form);
  
  setTimeout(() => alertDiv.remove(), 3000);
}

// Initialize review page
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  
  const reviewForm = document.getElementById('review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', handleSubmit);
  }
});