// Auth module for the inventory system

// Check if user is logged in and update UI accordingly
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    const guestElements = document.querySelectorAll('.guest-only');
    const userElements = document.querySelectorAll('.user-only');
    const adminElements = document.querySelectorAll('.admin-only');
    
    if (user) {
        // User is logged in
        guestElements.forEach(el => el.style.display = 'none');
        userElements.forEach(el => el.style.display = 'block');
        
        // Update username display
        const usernameElements = document.querySelectorAll('#username');
        usernameElements.forEach(el => el.textContent = user.username);
        
        // Show admin elements if user is admin
        if (user.isAdmin) {
            adminElements.forEach(el => el.style.display = 'block');
        } else {
            adminElements.forEach(el => el.style.display = 'none');
        }
        
        // Setup logout button
        const logoutButtons = document.querySelectorAll('#logout-btn');
        logoutButtons.forEach(btn => {
            btn.addEventListener('click', logout);
        });
    } else {
        // User is not logged in
        guestElements.forEach(el => el.style.display = 'block');
        userElements.forEach(el => el.style.display = 'none');
        adminElements.forEach(el => el.style.display = 'none');
        
        // Redirect to login if trying to access protected pages
        if (window.location.pathname.includes('my-products.html') || 
            window.location.pathname.includes('admin.html')) {
            window.location.href = 'login.html';
        }
    }
}

// Login function
function login(username, password) {
    // In a real application, this would make a fetch request to a backend API
    // For this example, we'll simulate login with localStorage
    
    // Simulated user data (in a real app, this would come from a server)
    const users = JSON.parse(localStorage.getItem('users')) || [
        { id: 1, username: 'admin', password: 'admin123', isAdmin: true },
        { id: 2, username: 'seller', password: 'seller123', isAdmin: false }
    ];
    
    // Find user
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Store user data (except password) in localStorage
        const { password: _, ...userData } = user;
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Redirect to home page
        window.location.href = 'index.html';
    } else {
        // Show error
        const errorElement = document.getElementById('login-error');
        if (errorElement) {
            errorElement.textContent = 'Invalid username or password';
            errorElement.style.display = 'block';
        }
    }
}

// Register function
function register(username, password, isAdmin) {
    // In a real application, this would make a fetch request to a backend API
    // For this example, we'll simulate registration with localStorage
    
    // Get existing users or create empty array
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if username already exists
    if (users.some(u => u.username === username)) {
        const errorElement = document.getElementById('register-error');
        if (errorElement) {
            errorElement.textContent = 'Username already exists';
            errorElement.style.display = 'block';
        }
        return;
    }
    
    // Create new user
    const newUser = {
        id: users.length + 1,
        username,
        password,
        isAdmin
    };
    
    // Add to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto-login the new user
    const { password: _, ...userData } = newUser;
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Logout function
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Initialize auth state when DOM is loaded
document.addEventListener('DOMContentLoaded', checkAuth);