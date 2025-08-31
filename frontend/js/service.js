// Check authentication
document.addEventListener('DOMContentLoaded', function() {
  checkAuth();
  loadHospitals();
});

// Check if user is authenticated (same as home.js)
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

// Load hospitals data
async function loadHospitals() {
  try {
    // In a real app, this would come from your API
    // For demo purposes, we're using static data
    const hospitals = [
      {
        id: 1,
        name: "AIIMS New Delhi",
        image: "https://images.unsplash.com/photo-1587351021759-3e566b3db4f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        services: ["Cardiology", "Neurology", "Orthopedics", "Pediatrics"],
        address: "Ansari Nagar, New Delhi - 110029",
        phone: "+91-11-26588500"
      },
      {
        id: 2,
        name: "AIIMS Jhajjar",
        image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        services: ["Oncology", "Cardiac Surgery", "Nephrology", "Endocrinology"],
        address: "Basthi Village, Jhajjar - 124105",
        phone: "+91-1251-220311"
      },
      {
        id: 3,
        name: "AIIMS Rishikesh",
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        services: ["Psychiatry", "Dermatology", "Ophthalmology", "ENT"],
        address: "Virbhadra, Rishikesh - 249203",
        phone: "+91-135-2461100"
      },
      {
        id: 4,
        name: "AIIMS Bhubaneswar",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        services: ["Gastroenterology", "Urology", "Plastic Surgery", "Rheumatology"],
        address: "Sijua, Bhubaneswar - 751019",
        phone: "+91-674-2476789"
      }
    ];
    
    displayHospitals(hospitals);
  } catch (error) {
    console.error('Error loading hospitals:', error);
  }
}

// Display hospitals in the UI
function displayHospitals(hospitals) {
  const hospitalsGrid = document.getElementById('hospitalsGrid');
  
  if (!hospitalsGrid) return;
  
  hospitalsGrid.innerHTML = '';
  
  hospitals.forEach(hospital => {
    const hospitalCard = document.createElement('div');
    hospitalCard.className = 'hospital-card';
    
    hospitalCard.innerHTML = `
      <img src="${hospital.image}" alt="${hospital.name}" class="hospital-image">
      <div class="hospital-info">
        <h3 class="hospital-name">${hospital.name}</h3>
        <p class="hospital-address">${hospital.address}</p>
        <p class="hospital-phone">${hospital.phone}</p>
        <div class="hospital-services">
          <strong>Services:</strong>
          <ul>
            ${hospital.services.map(service => `<li>${service}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
    
    hospitalsGrid.appendChild(hospitalCard);
  });
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}