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

// Load hospitals data
async function loadHospitals() {
  try {
    // Mock data - replace with actual API call
    const hospitals = [
      {
        id: 1,
        name: 'AIIMS New Delhi',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b3db4f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
        description: 'Premier medical institute with state-of-the-art facilities',
        services: ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology']
      }
    ];
    
    displayHospitals(hospitals);
  } catch (error) {
    console.error('Error loading hospitals:', error);
  }
}

// Display hospitals
function displayHospitals(hospitals) {
  const grid = document.getElementById('hospitals-grid');
  if (!grid) return;
  
  grid.innerHTML = hospitals.map(hospital => `
    <div class="card">
      <img src="${hospital.image}" alt="${hospital.name}" class="card-img">
      <div class="card-body">
        <h3 class="card-title">${hospital.name}</h3>
        <p class="card-text">${hospital.description}</p>
        <p class="card-text"><strong>Services:</strong> ${hospital.services.join(', ')}</p>
      </div>
    </div>
  `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadHospitals();
});