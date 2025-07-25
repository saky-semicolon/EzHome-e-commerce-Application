$(document).ready(function() {
    const userAuth = $('#user-auth');
    let loggedInUser = JSON.parse(localStorage.getItem('currentUser'));

    function updateUserAuthDisplay() {
        if (loggedInUser) {
            userAuth.html(`
                <div class="dropdown">
                    <button class="btn btn-outline-primary dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-user me-1"></i>${loggedInUser.username}
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                        <li><a class="dropdown-item" href="profile.html"><i class="fas fa-user-circle me-2"></i>My Profile</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item logout-btn" href="#" id="logout-button"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
                    </ul>
                </div>
            `);
            
            // Ensure dropdown is properly initialized
            const dropdownElement = document.getElementById('userDropdown');
            if (dropdownElement && typeof bootstrap !== 'undefined') {
                new bootstrap.Dropdown(dropdownElement);
            }
        } else {
            userAuth.html(`
                <a href="#" class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#loginModal">Login</a>
                <a href="#" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#registerModal">Register</a>
            `);
        }
        
        // Update cart display to show user-specific info
        updateCartUserInfo();
    }
    
    function updateCartUserInfo() {
        const cartIcon = $('#cart-icon a');
        if (loggedInUser) {
            cartIcon.attr('title', `${loggedInUser.username}'s Cart`);
        } else {
            cartIcon.attr('title', 'Guest Cart');
        }
    }

    // Login form submission
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        const username = $('#login-username').val();
        const password = $('#login-password').val();
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            loggedInUser = user;
            localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
            updateUserAuthDisplay();
            $('#loginModal').modal('hide');
            
            // Show success notification
            showNotification(`Welcome back, ${user.username}!`, 'success');
            
            // Trigger cart transfer event
            $(document).trigger('userLoggedIn');
        } else {
            showNotification('Invalid username or password. Please try again.', 'danger');
        }
    });

    // Register form submission
    $('#register-form').on('submit', function(e) {
        e.preventDefault();
        const username = $('#register-username').val();
        const password = $('#register-password').val();
        const email = $('#register-email').val();
        const phone = $('#register-phone').val();
        const address = $('#register-address').val();
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check if username already exists
        if (users.find(u => u.username === username)) {
            showNotification('Username already exists. Please choose a different username.', 'warning');
            return;
        }
        
        const newUser = {
            username,
            password, // In a real app, hash the password
            role: 'User',
            email,
            phone,
            address
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        loggedInUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
        
        updateUserAuthDisplay();
        $('#registerModal').modal('hide');
        
        // Show success notification
        showNotification(`Account created successfully! Welcome to EzHome, ${username}!`, 'success');
        
        // Trigger cart transfer event
        $(document).trigger('userLoggedIn');
    });


    // Enhanced logout button click handler with multiple selectors
    $(document).on('click', '#logout-button, .logout-btn', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Logout button clicked'); // Debug log
        
        // Add confirmation dialog for better UX
        if (confirm('Are you sure you want to logout?')) {
            try {
                loggedInUser = null;
                localStorage.removeItem('currentUser');
                updateUserAuthDisplay();
                
                // Trigger cart clear event
                $(document).trigger('userLoggedOut');
                
                // Show success message
                showNotification('You have been successfully logged out.', 'success');
                
                // Close any open dropdowns
                $('.dropdown-menu').removeClass('show');
                
                // Optionally redirect to home page if not already there
                if (window.location.pathname !== '/index.html' && !window.location.pathname.endsWith('/') && !window.location.pathname.endsWith('/index.html')) {
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                }
            } catch (error) {
                console.error('Error during logout:', error);
                showNotification('An error occurred during logout. Please try again.', 'danger');
            }
        }
    });

    // Initial auth display
    updateUserAuthDisplay();
    
    // Debug function for logout (can be called from console)
    window.debugLogout = function() {
        console.log('Current user:', loggedInUser);
        console.log('Logout button exists:', $('#logout-button').length > 0);
        console.log('User auth element:', $('#user-auth').html());
    };
    
    // Force refresh auth display every 5 seconds to catch any state issues
    setInterval(function() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser !== loggedInUser) {
            loggedInUser = currentUser;
            updateUserAuthDisplay();
        }
    }, 5000);
});

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = $(`
        <div class="alert alert-${type} alert-dismissible fade show position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    
    // Add to body
    $('body').append(notification);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        notification.alert('close');
    }, 3000);
}
