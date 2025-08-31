// Change from absolute URL to relative path
const API_BASE = '/api';

// Check authentication
function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }
}

// Load hospitals data
async function loadHospitals() {
  try {
    // In a real app, this would come from your API
    const hospitals = [
      {
        id: 1,
        name: 'AIIMS New Delhi',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b3db4f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
        description: 'Premier medical institute with state-of-the-art facilities',
        services: ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology']
      },
      {
        id: 2,
        name: 'AIIMS Jodhpur',
        image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
        description: 'Advanced healthcare services in Western India',
        services: ['Pediatrics', 'Gynecology', 'Dermatology', 'Psychiatry']
      },
      {
        id: 3,
        name: 'AIIMS Bhubaneswar',
        image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
        description: 'Leading healthcare provider in Eastern India',
        services: ['Nephrology', 'Endocrinology', 'Gastroenterology', 'Urology']
      }
    ];
    
    displayHospitals(hospitals);
  } catch (error) {
    console.error('Error loading hospitals:', error);
  }
}

// Display hospitals in the UI
function displayHospitals(hospitals) {
  const hospitalsGrid = document.getElementById('hospitals-grid');
  
  if (!hospitalsGrid) return;
  
  hospitalsGrid.innerHTML = hospitals.map(hospital => `
    <div class="card">
      <img src="${hospital.image}" alt="${hospital.name}" class="card-img">
      <div class="card-body">
        <h3 class="card-title">${hospital.name}</h3>
        <p class="card-text">${hospital.description}</p>
        <p class="card-text"><strong>Services:</strong> ${hospital.services.join(', ')}</p>
        <a href="#" class="btn">View Details</a>
      </div>
    </div>
  `).join('');
}

// Initialize service page
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadHospitals();
});