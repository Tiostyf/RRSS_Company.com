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

// Load doctors data
async function loadDoctors() {
  try {
    // Mock data - replace with actual API call
    const doctors = [
      {
        id: 1,
        name: 'Dr. Rajesh Kumar',
        specialty: 'Cardiologist',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
        description: 'Senior Cardiologist with 15+ years of experience'
      }
    ];
    
    displayDoctors(doctors);
  } catch (error) {
    console.error('Error loading doctors:', error);
  }
}

// Display doctors
function displayDoctors(doctors) {
  const grid = document.getElementById('doctors-grid');
  if (!grid) return;
  
  grid.innerHTML = doctors.map(doctor => `
    <div class="card">
      <img src="${doctor.image}" alt="${doctor.name}" class="card-img">
      <div class="card-body">
        <h3 class="card-title">${doctor.name}</h3>
        <p class="card-text"><strong>Specialty:</strong> ${doctor.specialty}</p>
        <p class="card-text">${doctor.description}</p>
      </div>
    </div>
  `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadDoctors();
});