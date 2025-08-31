// Check authentication
document.addEventListener('DOMContentLoaded', function() {
  checkAuth();
  loadPosts();
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

// Handle appointment form submission
const appointmentForm = document.getElementById('appointmentForm');
if (appointmentForm) {
  appointmentForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const description = document.getElementById('description').value;
    const review = document.getElementById('review').value;
    const appointmentDate = document.getElementById('appointmentDate').value;
    const department = document.getElementById('department').value;
    const imageInput = document.getElementById('image');
    
    // Simple validation
    if (!description || !review || !appointmentDate || !department) {
      showAlert('Please fill all required fields', 'error');
      return;
    }
    
    try {
      // In a real application, you would upload the image to a storage service
      // and then get the URL to save in your database
      // For this demo, we'll just use a placeholder
      const imageUrl = imageInput.files.length > 0 
        ? URL.createObjectURL(imageInput.files[0]) 
        : 'https://images.unsplash.com/photo-1587351021759-3e566b3db4f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80';
      
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          image: imageUrl,
          description,
          review,
          appointmentDate,
          department
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showAlert('Appointment review submitted successfully!', 'success');
        appointmentForm.reset();
        loadPosts(); // Reload posts to show the new one
      } else {
        showAlert(data.message, 'error');
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
      showAlert('An error occurred. Please try again.', 'error');
    }
  });
}

// Load posts from the server
async function loadPosts() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/posts', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const posts = await response.json();
      displayPosts(posts);
    } else {
      console.error('Failed to load posts');
    }
  } catch (error) {
    console.error('Error loading posts:', error);
  }
}

// Display posts in the UI
function displayPosts(posts) {
  const postsContainer = document.getElementById('postsContainer');
  
  if (!postsContainer) return;
  
  // Clear existing posts
  postsContainer.innerHTML = '';
  
  if (posts.length === 0) {
    postsContainer.innerHTML = '<p class="text-center">No appointment reviews yet.</p>';
    return;
  }
  
  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    
    const appointmentDate = new Date(post.appointmentDate).toLocaleDateString();
    const postDate = new Date(post.createdAt).toLocaleDateString();
    
    postElement.innerHTML = `
      <div class="post-header">
        <span class="post-author">${post.name}</span>
        <span class="post-date">Appointment: ${appointmentDate} | Posted: ${postDate}</span>
      </div>
      ${post.image ? `<img src="${post.image}" alt="Appointment image" class="post-image">` : ''}
      <div class="post-description">
        <strong>Department:</strong> ${post.department}<br>
        <strong>Description:</strong> ${post.description}
      </div>
      <div class="post-review">"${post.review}"</div>
    `;
    
    postsContainer.appendChild(postElement);
  });
}

// Show alert message
function showAlert(message, type) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.appendChild(document.createTextNode(message));
  
  // Insert after the form title or at the top of the form
  const form = document.querySelector('.main-content');
  form.insertBefore(alertDiv, form.firstChild);
  
  // Remove alert after 3 seconds
  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}