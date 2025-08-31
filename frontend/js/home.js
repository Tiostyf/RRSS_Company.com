// Change from absolute URL to relative path
const API_BASE = '/api';

// Check authentication
function checkAuth() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return;
  }
  
  // Set up logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = '/login';
    });
  }
}

// Load doctors data
async function loadDoctors() {
  try {
    // In a real app, this would come from your API
    const doctors = [
      {
        id: 1,
        name: 'Dr. Rajesh Kumar',
        specialty: 'Cardiologist',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
        description: 'Senior Cardiologist with 15+ years of experience'
      },
      {
        id: 2,
        name: 'Dr. Priya Sharma',
        specialty: 'Neurologist',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
        description: 'Expert in neurological disorders and treatments'
      },
      {
        id: 3,
        name: 'Dr. Amit Patel',
        specialty: 'Orthopedic Surgeon',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
        description: 'Specialized in joint replacement and arthroscopy'
      }
    ];
    
    displayDoctors(doctors);
  } catch (error) {
    console.error('Error loading doctors:', error);
  }
}

// Display doctors in the UI
function displayDoctors(doctors) {
  const doctorsGrid = document.getElementById('doctors-grid');
  
  if (!doctorsGrid) return;
  
  doctorsGrid.innerHTML = doctors.map(doctor => `
    <div class="card">
      <img src="${doctor.image}" alt="${doctor.name}" class="card-img">
      <div class="card-body">
        <h3 class="card-title">${doctor.name}</h3>
        <p class="card-text"><strong>Specialty:</strong> ${doctor.specialty}</p>
        <p class="card-text">${doctor.description}</p>
        <a href="#" class="btn">View Profile</a>
      </div>
    </div>
  `).join('');
}

// Initialize home page
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  loadDoctors();
});