// Check authentication
document.addEventListener('DOMContentLoaded', function() {
  checkAuth();
  loadDoctors();
});

// Check if user is authenticated
async function checkAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    window.location.href = '/login';
    return;
  }
  
  try {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!data.valid) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else {
      // Display user info
      const userData = JSON.parse(user);
      document.getElementById('userName').textContent = userData.name;
    }
  } catch (error) {
    console.error('Auth verification failed:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}

// Load doctors data
async function loadDoctors() {
  try {
    // In a real app, this would come from your API
    // For demo purposes, we're using static data
    const doctors = [
      {
        id: 1,
        name: "Dr. Rajesh Kumar",
        department: "Cardiology",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        experience: "15 years",
        qualifications: "MD, DM Cardiology"
      },
      {
        id: 2,
        name: "Dr. Priya Sharma",
        department: "Neurology",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        experience: "12 years",
        qualifications: "MD, DM Neurology"
      },
      {
        id: 3,
        name: "Dr. Amit Singh",
        department: "Orthopedics",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        experience: "18 years",
        qualifications: "MS Orthopedics"
      },
      {
        id: 4,
        name: "Dr. Sunita Patel",
        department: "Pediatrics",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        experience: "10 years",
        qualifications: "MD Pediatrics"
      }
    ];
    
    displayDoctors(doctors);
  } catch (error) {
    console.error('Error loading doctors:', error);
  }
}

// Display doctors in the UI
function displayDoctors(doctors) {
  const doctorsGrid = document.getElementById('doctorsGrid');
  
  if (!doctorsGrid) return;
  
  doctorsGrid.innerHTML = '';
  
  doctors.forEach(doctor => {
    const doctorCard = document.createElement('div');
    doctorCard.className = 'doctor-card';
    
    doctorCard.innerHTML = `
      <img src="${doctor.image}" alt="${doctor.name}" class="doctor-image">
      <div class="doctor-info">
        <h3 class="doctor-name">${doctor.name}</h3>
        <p class="doctor-department">${doctor.department}</p>
        <p class="doctor-experience">Experience: ${doctor.experience}</p>
        <p class="doctor-qualifications">${doctor.qualifications}</p>
      </div>
    `;
    
    doctorsGrid.appendChild(doctorCard);
  });
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}