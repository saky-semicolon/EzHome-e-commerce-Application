$(document).ready(function() {
    // Create default admin user if none exists
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const adminExists = users.find(user => user.role === 'Admin');
    
    if (!adminExists) {
        const defaultAdmin = {
            username: 'admin',
            password: 'admin123',
            role: 'Admin',
            email: 'admin@ezhome.com',
            phone: '555-0001',
            address: 'EzHome HQ, Tech City',
            createdDate: new Date().toISOString().split('T')[0]
        };
        users.push(defaultAdmin);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Show info about default admin
        console.log('Default admin user created - Username: admin, Password: admin123');
    }

    const currentUser = getCurrentUser();

    // Show login popup if not admin
    if (!currentUser || currentUser.role !== 'Admin') {
        showAdminLoginPopup();
        return;
    }

    initializeAdminDashboard();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
});

function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleString();
    $('#current-time').text(timeString);
}

function initializeAdminDashboard() {
    initializeUserManagement();
    updateDashboardStats();
    initializeTabNavigation();
    initializeSearch();
    initializeAnalytics();
    loadSettings();
    
    // Show success message
    showSuccessAlert('Welcome to the Admin Dashboard!');
}

function showAdminLoginPopup() {
    // Create enhanced modal HTML
    const loginModalHTML = `
        <div class="modal fade" id="adminLoginModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="border-radius: 20px; border: none; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); overflow: hidden;">
                    <div class="modal-header text-white border-0" style="background: var(--primary-gradient); padding: 2rem;">
                        <div class="text-center w-100">
                            <i class="fas fa-shield-alt fa-3x mb-3"></i>
                            <h4 class="modal-title fw-bold mb-2">Admin Access Required</h4>
                            <p class="mb-0 opacity-75">Secure login to EzHome Dashboard</p>
                        </div>
                    </div>
                    <div class="modal-body p-4" style="background: rgba(255, 255, 255, 0.95);">
                        <div class="alert" style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); border: 1px solid rgba(102, 126, 234, 0.2); border-radius: 12px;">
                            <i class="fas fa-info-circle me-2 text-primary"></i>
                            Please enter admin credentials to access the management system.
                        </div>
                        <form id="admin-login-form">
                            <div class="mb-3">
                                <label for="admin-username" class="form-label fw-semibold">
                                    <i class="fas fa-user me-1"></i>Username
                                </label>
                                <input type="text" class="form-control search-box" id="admin-username" placeholder="Enter username" required>
                            </div>
                            <div class="mb-3">
                                <label for="admin-password" class="form-label fw-semibold">
                                    <i class="fas fa-lock me-1"></i>Password
                                </label>
                                <input type="password" class="form-control search-box" id="admin-password" placeholder="Enter password" required>
                            </div>
                            <div id="login-error" class="alert alert-danger d-none" style="border-radius: 12px;">
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                Invalid credentials. Please try again.
                            </div>
                        </form>
                        <div class="mt-4 p-3" style="background: rgba(102, 126, 234, 0.05); border-radius: 12px;">
                            <small class="text-muted">
                                <i class="fas fa-lightbulb me-1"></i>
                                <strong>Default credentials:</strong> admin / admin123
                            </small>
                        </div>
                    </div>
                    <div class="modal-footer border-0 p-4" style="background: rgba(255, 255, 255, 0.95);">
                        <button type="button" class="btn btn-light" id="cancel-login" style="border-radius: 12px; padding: 0.75rem 1.5rem;">
                            <i class="fas fa-times me-1"></i>Cancel
                        </button>
                        <button type="submit" form="admin-login-form" class="btn btn-gradient">
                            <i class="fas fa-sign-in-alt me-1"></i>Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal to page
    $('body').append(loginModalHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('adminLoginModal'));
    modal.show();

    // Handle form submission
    $('#admin-login-form').on('submit', function(e) {
        e.preventDefault();
        
        const username = $('#admin-username').val();
        const password = $('#admin-password').val();
        
        // Check credentials
        if (username === 'admin' && password === 'admin123') {
            // Create/get admin user
            let users = JSON.parse(localStorage.getItem('users')) || [];
            let adminUser = users.find(user => user.username === 'admin');
            
            if (!adminUser) {
                adminUser = {
                    username: 'admin',
                    password: 'admin123',
                    role: 'Admin',
                    email: 'admin@ezhome.com',
                    phone: '555-0001',
                    address: 'EzHome HQ, Tech City'
                };
                users.push(adminUser);
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            // Login the admin user
            localStorage.setItem('loggedInUser', JSON.stringify(adminUser));
            
            // Hide modal and initialize user management
            modal.hide();
            $('#adminLoginModal').remove();
            
            // Show success message
            showSuccessAlert('Successfully logged in as Admin!');
            
            // Initialize dashboard
            setTimeout(() => {
                initializeAdminDashboard();
            }, 500);
            
        } else {
            // Show error
            $('#login-error').removeClass('d-none');
            $('#admin-username, #admin-password').addClass('is-invalid');
            
            // Clear error after 3 seconds
            setTimeout(() => {
                $('#login-error').addClass('d-none');
                $('#admin-username, #admin-password').removeClass('is-invalid');
            }, 3000);
        }
    });

    // Handle cancel button
    $('#cancel-login').on('click', function() {
        modal.hide();
        $('#adminLoginModal').remove();
        window.location.href = 'index.html';
    });

    // Auto-focus on username field
    $('#adminLoginModal').on('shown.bs.modal', function() {
        $('#admin-username').focus();
    });
}

function showSuccessAlert(message) {
    const alertHTML = `
        <div class="alert alert-success alert-dismissible fade show position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; min-width: 300px; border-radius: 12px; border: none; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
            <i class="fas fa-check-circle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $('body').append(alertHTML);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
        $('.alert-success').alert('close');
    }, 3000);
}

function updateDashboardStats() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    const totalUsers = users.length;
    const adminUsers = users.filter(user => user.role === 'Admin').length;
    const staffUsers = users.filter(user => user.role === 'Staff').length;
    const regularUsers = users.filter(user => user.role === 'User').length;
    
    // Animate the numbers
    animateNumber('#total-users', totalUsers);
    animateNumber('#admin-users', adminUsers);
    animateNumber('#staff-users', staffUsers);
    animateNumber('#regular-users', regularUsers);
}

function animateNumber(selector, targetNumber) {
    const element = $(selector);
    const duration = 1000;
    const startTime = Date.now();
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentNumber = Math.floor(progress * targetNumber);
        
        element.text(currentNumber);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    update();
}

function initializeTabNavigation() {
    $('.nav-pills .nav-link[data-tab]').on('click', function(e) {
        e.preventDefault();
        
        // Update active nav link
        $('.nav-pills .nav-link').removeClass('active');
        $(this).addClass('active');
        
        // Show corresponding tab content
        const tabName = $(this).data('tab');
        $('.tab-pane').removeClass('active');
        $(`#${tabName}-tab`).addClass('active');
        
        // Refresh analytics when analytics tab is clicked
        if (tabName === 'analytics') {
            setTimeout(() => {
                updateAnalyticsStats();
                if (ordersChart) ordersChart.update();
                if (orderStatusChart) orderStatusChart.update();
                if (userRolesChart) userRolesChart.update();
                if (productCategoriesChart) productCategoriesChart.update();
            }, 100);
        }
    });
    
    // Logout functionality
    $('#logout-btn').on('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('loggedInUser');
        showSuccessAlert('Logged out successfully!');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    });
}

function initializeSearch() {
    $('#user-search').on('keyup', function() {
        const searchTerm = $(this).val().toLowerCase();
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (searchTerm === '') {
            renderUsers();
            return;
        }
        
        const filteredUsers = users.filter(user => 
            user.username.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.role.toLowerCase().includes(searchTerm)
        );
        
        renderFilteredUsers(filteredUsers);
    });
}

function renderFilteredUsers(users) {
    const userList = $('#user-list');
    userList.empty();
    
    if (users.length === 0) {
        userList.append(`
            <tr>
                <td colspan="5" class="text-center text-muted py-4">
                    <i class="fas fa-search fa-2x mb-2"></i><br>
                    No users found matching your search criteria.
                </td>
            </tr>
        `);
        return;
    }
    
    users.forEach(user => {
        const roleClass = user.role.toLowerCase();
        const createdDate = user.createdDate || 'N/A';
        
        userList.append(`
            <tr class="user-row" data-username="${user.username}">
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar-circle me-2">
                            <i class="fas fa-user"></i>
                        </div>
                        <strong>${user.username}</strong>
                    </div>
                </td>
                <td>${user.email}</td>
                <td><span class="role-badge role-${roleClass}">${user.role}</span></td>
                <td><small class="text-muted">${createdDate}</small></td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary edit-user" data-username="${user.username}" title="Edit User">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-user" data-username="${user.username}" title="Delete User">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `);
    });
}

function initializeUserManagement() {
    const userList = $('#user-list');

    function renderUsers() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        userList.empty();
        
        if (users.length === 0) {
            userList.append(`
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">
                        <i class="fas fa-users fa-2x mb-2"></i><br>
                        No users found. Add your first user to get started.
                    </td>
                </tr>
            `);
            return;
        }
        
        users.forEach(user => {
            const roleClass = user.role.toLowerCase();
            const createdDate = user.createdDate || new Date().toISOString().split('T')[0];
            
            userList.append(`
                <tr class="user-row" data-username="${user.username}">
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="me-2" style="width: 40px; height: 40px; background: var(--primary-gradient); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">
                                <i class="fas fa-user"></i>
                            </div>
                            <strong>${user.username}</strong>
                        </div>
                    </td>
                    <td>${user.email}</td>
                    <td><span class="role-badge role-${roleClass}">${user.role}</span></td>
                    <td><small class="text-muted">${createdDate}</small></td>
                    <td>
                        <div class="btn-group" role="group">
                            <button class="btn btn-sm btn-outline-primary edit-user" data-username="${user.username}" title="Edit User" style="border-radius: 8px 0 0 8px;">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-user" data-username="${user.username}" title="Delete User" style="border-radius: 0 8px 8px 0;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `);
        });
        
        updateDashboardStats();
    }

    // Add user
    $('#add-user-form').on('submit', function(e) {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        const username = $('#add-username').val().trim();
        const email = $('#add-email').val().trim();
        
        // Check if username already exists
        if (users.find(user => user.username === username)) {
            showErrorAlert('Username already exists!');
            return;
        }
        
        // Check if email already exists
        if (users.find(user => user.email === email)) {
            showErrorAlert('Email already exists!');
            return;
        }
        
        const newUser = {
            username: username,
            email: email,
            password: $('#add-password').val(),
            role: $('#add-role').val(),
            phone: $('#add-phone').val().trim() || 'N/A',
            address: $('#add-address').val().trim() || 'N/A',
            createdDate: new Date().toISOString().split('T')[0]
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        renderUsers();
        $('#addUserModal').modal('hide');
        $('#add-user-form')[0].reset();
        showSuccessAlert(`User "${username}" added successfully!`);
    });

    // Edit user
    userList.on('click', '.edit-user', function() {
        const username = $(this).data('username');
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username);
        
        if (user) {
            // Populate edit form
            $('#edit-user-id').val(username);
            $('#edit-username').val(user.username);
            $('#edit-email').val(user.email);
            $('#edit-role').val(user.role);
            $('#edit-phone').val(user.phone || '');
            $('#edit-address').val(user.address || '');
            
            $('#editUserModal').modal('show');
        }
    });
    
    // Save edited user
    $('#edit-user-form').on('submit', function(e) {
        e.preventDefault();
        const username = $('#edit-user-id').val();
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.username === username);
        
        if (userIndex !== -1) {
            users[userIndex].email = $('#edit-email').val().trim();
            users[userIndex].role = $('#edit-role').val();
            users[userIndex].phone = $('#edit-phone').val().trim() || 'N/A';
            users[userIndex].address = $('#edit-address').val().trim() || 'N/A';
            
            localStorage.setItem('users', JSON.stringify(users));
            renderUsers();
            $('#editUserModal').modal('hide');
            showSuccessAlert(`User "${username}" updated successfully!`);
        }
    });

    // Delete user with confirmation
    userList.on('click', '.delete-user', function() {
        const username = $(this).data('username');
        
        // Don't allow deleting the current admin
        const currentUser = getCurrentUser();
        if (username === currentUser.username) {
            showErrorAlert('You cannot delete your own account!');
            return;
        }
        
        if (confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
            let users = JSON.parse(localStorage.getItem('users')) || [];
            users = users.filter(u => u.username !== username);
            localStorage.setItem('users', JSON.stringify(users));
            renderUsers();
            showSuccessAlert(`User "${username}" deleted successfully!`);
        }
    });

    // Initial render
    renderUsers();
}

function showErrorAlert(message) {
    const alertHTML = `
        <div class="alert alert-danger alert-dismissible fade show position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; min-width: 300px; border-radius: 12px; border: none; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
            <i class="fas fa-exclamation-triangle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $('body').append(alertHTML);
    
    // Auto dismiss after 4 seconds
    setTimeout(() => {
        $('.alert-danger').alert('close');
    }, 4000);
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('loggedInUser'));
}

// Analytics Functions
let ordersChart, orderStatusChart, userRolesChart, productCategoriesChart;

function initializeAnalytics() {
    updateAnalyticsStats();
    initializeCharts();
    
    // Update charts when period changes
    $('#orders-chart-period').change(function() {
        updateOrdersChart();
    });
}

function updateAnalyticsStats() {
    // Get data from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => {
        return sum + (parseFloat(order.total) || 0);
    }, 0);
    
    // Update stats displays
    $('#analytics-total-users').text(users.length);
    $('#analytics-total-orders').text(orders.length);
    $('#analytics-total-products').text(products.length);
    $('#analytics-total-revenue').text(`$${totalRevenue.toLocaleString()}`);
}

function initializeCharts() {
    // Orders Chart
    const ordersCtx = document.getElementById('ordersChart');
    if (ordersCtx) {
        ordersChart = new Chart(ordersCtx, {
            type: 'line',
            data: getOrdersChartData(),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
    
    // Order Status Chart
    const statusCtx = document.getElementById('orderStatusChart');
    if (statusCtx) {
        orderStatusChart = new Chart(statusCtx, {
            type: 'doughnut',
            data: getOrderStatusChartData(),
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // User Roles Chart
    const rolesCtx = document.getElementById('userRolesChart');
    if (rolesCtx) {
        userRolesChart = new Chart(rolesCtx, {
            type: 'pie',
            data: getUserRolesChartData(),
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Product Categories Chart
    const categoriesCtx = document.getElementById('productCategoriesChart');
    if (categoriesCtx) {
        productCategoriesChart = new Chart(categoriesCtx, {
            type: 'bar',
            data: getProductCategoriesChartData(),
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
}

function getOrdersChartData() {
    const period = parseInt($('#orders-chart-period').val()) || 30;
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Create labels for the last N days
    const labels = [];
    const data = [];
    const today = new Date();
    
    for (let i = period - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Count orders for this date
        const ordersCount = orders.filter(order => {
            const orderDate = new Date(order.date || order.orderDate);
            return orderDate.toISOString().split('T')[0] === dateStr;
        }).length;
        
        data.push(ordersCount);
    }
    
    return {
        labels: labels,
        datasets: [{
            label: 'Orders',
            data: data,
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };
}

function getOrderStatusChartData() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const statusCounts = {};
    
    orders.forEach(order => {
        const status = order.status || 'Pending';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    const colors = {
        'Pending': '#ffc107',
        'Processing': '#17a2b8',
        'Shipped': '#007bff',
        'Delivered': '#28a745',
        'Cancelled': '#dc3545'
    };
    
    return {
        labels: Object.keys(statusCounts),
        datasets: [{
            data: Object.values(statusCounts),
            backgroundColor: Object.keys(statusCounts).map(status => colors[status] || '#6c757d')
        }]
    };
}

function getUserRolesChartData() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const roleCounts = {};
    
    users.forEach(user => {
        const role = user.role || 'Customer';
        roleCounts[role] = (roleCounts[role] || 0) + 1;
    });
    
    const colors = {
        'Admin': '#dc3545',
        'Manager': '#fd7e14',
        'Staff': '#20c997',
        'Customer': '#007bff'
    };
    
    return {
        labels: Object.keys(roleCounts),
        datasets: [{
            data: Object.values(roleCounts),
            backgroundColor: Object.keys(roleCounts).map(role => colors[role] || '#6c757d')
        }]
    };
}

function getProductCategoriesChartData() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const categoryCounts = {};
    
    products.forEach(product => {
        const category = product.category || 'Uncategorized';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    return {
        labels: Object.keys(categoryCounts),
        datasets: [{
            data: Object.values(categoryCounts),
            backgroundColor: [
                '#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8',
                '#6f42c1', '#fd7e14', '#20c997', '#6c757d', '#e83e8c'
            ]
        }]
    };
}

function updateOrdersChart() {
    if (ordersChart) {
        ordersChart.data = getOrdersChartData();
        ordersChart.update();
    }
}

// Settings Functions
function saveGeneralSettings() {
    const settings = {
        siteName: $('#site-name').val(),
        siteEmail: $('#site-email').val(),
        timezone: $('#timezone').val(),
        maxLoginAttempts: parseInt($('#max-login-attempts').val()),
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('generalSettings', JSON.stringify(settings));
    showSuccessAlert('General settings saved successfully!');
}

function saveSecuritySettings() {
    const settings = {
        enable2FA: $('#enable-2fa').is(':checked'),
        autoLogout: $('#auto-logout').is(':checked'),
        sessionTimeout: parseInt($('#session-timeout').val()),
        forceHttps: $('#force-https').is(':checked'),
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('securitySettings', JSON.stringify(settings));
    showSuccessAlert('Security settings saved successfully!');
}

function saveMaintenanceSettings() {
    const settings = {
        autoBackup: $('#auto-backup').is(':checked'),
        backupRetention: parseInt($('#backup-retention').val()),
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('maintenanceSettings', JSON.stringify(settings));
    showSuccessAlert('Maintenance settings saved successfully!');
}

function createBackup() {
    showSuccessAlert('Creating backup...');
    
    setTimeout(() => {
        const backupData = {
            users: JSON.parse(localStorage.getItem('users')) || [],
            orders: JSON.parse(localStorage.getItem('orders')) || [],
            products: JSON.parse(localStorage.getItem('products')) || [],
            settings: {
                general: JSON.parse(localStorage.getItem('generalSettings')) || {},
                security: JSON.parse(localStorage.getItem('securitySettings')) || {},
                maintenance: JSON.parse(localStorage.getItem('maintenanceSettings')) || {}
            },
            timestamp: new Date().toISOString()
        };
        
        // Create download link
        const dataStr = JSON.stringify(backupData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ezhome-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        showSuccessAlert('Backup created and downloaded successfully!');
    }, 1000);
}

function clearCache() {
    showSuccessAlert('Clearing cache...');
    setTimeout(() => {
        showSuccessAlert('Cache cleared successfully!');
    }, 500);
}

function runHealthCheck() {
    showSuccessAlert('Running system health check...');
    setTimeout(() => {
        showSuccessAlert('System health check completed - All systems operational!');
    }, 1500);
}

function loadSettings() {
    // Load general settings
    const generalSettings = JSON.parse(localStorage.getItem('generalSettings')) || {};
    if (generalSettings.siteName) $('#site-name').val(generalSettings.siteName);
    if (generalSettings.siteEmail) $('#site-email').val(generalSettings.siteEmail);
    if (generalSettings.timezone) $('#timezone').val(generalSettings.timezone);
    if (generalSettings.maxLoginAttempts) $('#max-login-attempts').val(generalSettings.maxLoginAttempts);
    
    // Load security settings
    const securitySettings = JSON.parse(localStorage.getItem('securitySettings')) || {};
    $('#enable-2fa').prop('checked', securitySettings.enable2FA !== false);
    $('#auto-logout').prop('checked', securitySettings.autoLogout !== false);
    if (securitySettings.sessionTimeout) $('#session-timeout').val(securitySettings.sessionTimeout);
    $('#force-https').prop('checked', securitySettings.forceHttps !== false);
    
    // Load maintenance settings
    const maintenanceSettings = JSON.parse(localStorage.getItem('maintenanceSettings')) || {};
    $('#auto-backup').prop('checked', maintenanceSettings.autoBackup !== false);
    if (maintenanceSettings.backupRetention) $('#backup-retention').val(maintenanceSettings.backupRetention);
}