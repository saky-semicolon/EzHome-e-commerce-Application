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
            address: 'EzHome HQ, Tech City'
        };
        users.push(defaultAdmin);
        localStorage.setItem('users', JSON.stringify(users));
        
        console.log('Default admin user created - Username: admin, Password: admin123');
    }

    const currentUser = getCurrentUser();

    // Show login popup if not admin
    if (!currentUser || currentUser.role !== 'Admin') {
        showAdminLoginPopup();
        return;
    }

    initializeOrderDashboard();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
});

function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleString();
    $('#current-time').text(timeString);
}

function initializeOrderDashboard() {
    initializeOrderManagement();
    updateOrderStats();
    initializeTabNavigation();
    initializeSearch();
    initializeAnalytics();
    initializeReports();
    
    // Show success message
    showSuccessAlert('Welcome to Order Management Dashboard!');
}

// Function to create sample products if they don't exist
function createSampleProductsIfNeeded() {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    if (products.length === 0) {
        const sampleProducts = [
            {
                id: 'PRD001',
                name: 'Smart LED Bulb Set',
                category: 'Lighting',
                price: 79.99,
                stock: 25,
                image: 'Smart LED Bulb Set.JPG',
                image_url: 'images/Smart LED Bulb Set.JPG',
                description: 'Energy-efficient smart LED bulbs with color changing capabilities',
                features: 'WiFi enabled, Voice control, Energy saving, 16 million colors',
                specifications: '9W, E27 base, 800 lumens, 2.4GHz WiFi',
                createdDate: new Date().toISOString()
            },
            {
                id: 'PRD002',
                name: 'Smart Thermostat Pro',
                category: 'Climate',
                price: 299.99,
                stock: 15,
                image: 'Smart Thermostat Pro.JPG',
                image_url: 'images/Smart Thermostat Pro.JPG',
                description: 'Advanced programmable thermostat with learning capabilities',
                features: 'Learning algorithm, Remote control, Energy reports, Geofencing',
                specifications: 'WiFi, Touch screen, 24V power, Compatible with most HVAC',
                createdDate: new Date().toISOString()
            },
            {
                id: 'PRD003',
                name: 'Smart Door Lock',
                category: 'Security',
                price: 199.99,
                stock: 8,
                image: 'Smart Door Lock.JPG',
                image_url: 'images/Smart Door Lock.JPG',
                description: 'Keyless entry smart lock with multiple access methods',
                features: 'Fingerprint, PIN code, Mobile app, Auto-lock',
                specifications: 'Bluetooth 5.0, Battery powered, Weather resistant',
                createdDate: new Date().toISOString()
            },
            {
                id: 'PRD004',
                name: 'Smart Security Camera',
                category: 'Security',
                price: 149.99,
                stock: 20,
                image: 'Smart Security Camera.JPG',
                image_url: 'images/Smart Security Camera.JPG',
                description: '1080p HD security camera with night vision',
                features: '1080p HD, Night vision, Motion detection, Cloud storage',
                specifications: '1080p resolution, 140° viewing angle, IP65 waterproof',
                createdDate: new Date().toISOString()
            },
            {
                id: 'PRD005',
                name: 'Smart Air Purifier',
                category: 'Climate',
                price: 399.99,
                stock: 0,
                image: 'Smart Air Purifier.PNG',
                image_url: 'images/Smart Air Purifier.PNG',
                description: 'HEPA air purifier with smart monitoring',
                features: 'HEPA filter, Air quality monitoring, Auto mode, App control',
                specifications: 'CADR 300m³/h, Room size up to 40m², Noise level <45dB',
                createdDate: new Date().toISOString()
            },
            {
                id: 'PRD006',
                name: 'Smart Motion Sensor',
                category: 'Automation',
                price: 59.99,
                stock: 30,
                image: 'Smart Motion Sensor.JPG',
                image_url: 'images/Smart Motion Sensor.JPG',
                description: 'PIR motion sensor for home automation',
                features: 'PIR technology, Wide detection range, Battery powered, Wireless',
                specifications: '120° detection angle, 7m range, 2-year battery life',
                createdDate: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('products', JSON.stringify(sampleProducts));
    }
}

// Function to enrich order items with product information
function enrichOrderItems(orders) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    return orders.map(order => {
        const enrichedItems = order.items.map(item => {
            // Find matching product by name
            const product = products.find(p => p.name === item.name);
            
            if (product) {
                return {
                    ...item,
                    image_url: product.image_url || product.image ? `images/${product.image || product.image_url}` : 'images/placeholder.png',
                    category: product.category || 'N/A'
                };
            } else {
                // Fallback for items without matching products
                return {
                    ...item,
                    image_url: item.image_url || 'images/placeholder.png',
                    category: item.category || 'N/A'
                };
            }
        });
        
        return {
            ...order,
            items: enrichedItems
        };
    });
}

function updateOrderStats() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const shippedOrders = orders.filter(order => order.status === 'shipped').length;
    const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
    
    // Animate the numbers
    animateNumber('#total-orders', totalOrders);
    animateNumber('#pending-orders', pendingOrders);
    animateNumber('#shipped-orders', shippedOrders);
    animateNumber('#delivered-orders', deliveredOrders);
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
        
        // Refresh data when analytics or reports tabs are clicked
        if (tabName === 'analytics') {
            setTimeout(() => {
                updateAnalyticsStats();
                if (salesChart) salesChart.update();
                if (orderStatusChart) orderStatusChart.update();
                if (monthlyRevenueChart) monthlyRevenueChart.update();
                if (topProductsChart) topProductsChart.update();
            }, 100);
        } else if (tabName === 'reports') {
            setTimeout(() => {
                previewReport();
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
    $('#order-search').on('keyup', function() {
        const searchTerm = $(this).val().toLowerCase();
        filterOrders();
    });
    
    $('#status-filter').on('change', function() {
        filterOrders();
    });
}

function filterOrders() {
    const searchTerm = $('#order-search').val().toLowerCase();
    const statusFilter = $('#status-filter').val();
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    let filteredOrders = orders;
    
    if (searchTerm) {
        filteredOrders = filteredOrders.filter(order => 
            order.id.toLowerCase().includes(searchTerm) ||
            order.customerName.toLowerCase().includes(searchTerm) ||
            order.customerEmail.toLowerCase().includes(searchTerm)
        );
    }
    
    if (statusFilter) {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }
    
    renderFilteredOrders(filteredOrders);
}

function renderFilteredOrders(orders) {
    const orderList = $('#order-list');
    orderList.empty();
    
    if (orders.length === 0) {
        orderList.append(`
            <tr>
                <td colspan="8" class="text-center text-muted py-4">
                    <i class="fas fa-search fa-2x mb-2"></i><br>
                    No orders found matching your criteria.
                </td>
            </tr>
        `);
        return;
    }
    
    // Enrich orders with product information
    const enrichedOrders = enrichOrderItems(orders);
    
    enrichedOrders.forEach(order => {
        const statusClass = order.status.toLowerCase();
        const orderDate = new Date(order.date).toLocaleDateString();
        const itemCount = Array.isArray(order.items) ? order.items.length : 0;
        
        orderList.append(`
            <tr class="user-row" data-order-id="${order.id}">
                <td>
                    <strong>#${order.id}</strong>
                </td>
                <td>
                    <div>
                        <strong>${order.customerName}</strong><br>
                        <small class="text-muted">${order.customerEmail}</small>
                    </div>
                </td>
                <td>
                    <span class="badge bg-light text-dark">${itemCount} item${itemCount !== 1 ? 's' : ''}</span>
                </td>
                <td>
                    <strong>$${parseFloat(order.total || 0).toFixed(2)}</strong>
                </td>
                <td>
                    <span class="badge bg-info">${order.paymentMethod || 'N/A'}</span>
                </td>
                <td>
                    <span class="status-badge status-${statusClass}">${order.status}</span>
                </td>
                <td>
                    <small class="text-muted">${orderDate}</small>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary view-order" data-order-id="${order.id}" title="View Details" style="border-radius: 8px 0 0 8px;">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-success update-status" data-order-id="${order.id}" title="Update Status" style="border-radius: 0 8px 8px 0;">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `);
    });
}

function initializeOrderManagement() {
    // Create sample orders if none exist
    createSampleOrders();
    
    const orderList = $('#order-list');

    function renderOrders() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        renderFilteredOrders(orders);
        updateOrderStats();
    }

    // View order details
    orderList.on('click', '.view-order', function() {
        const orderId = $(this).data('order-id');
        showOrderDetails(orderId);
    });

    // Update order status
    orderList.on('click', '.update-status', function() {
        const orderId = $(this).data('order-id');
        showStatusUpdateModal(orderId);
    });

    // Status update form submission
    $('#status-update-form').on('submit', function(e) {
        e.preventDefault();
        const orderId = $('#update-order-id').val();
        const newStatus = $('#new-status').val();
        const note = $('#status-note').val();
        
        updateOrderStatus(orderId, newStatus, note);
        $('#statusUpdateModal').modal('hide');
        renderOrders();
        showSuccessAlert(`Order #${orderId} status updated to ${newStatus}!`);
    });

    // Initial render
    renderOrders();
}

function createSampleOrders() {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    if (orders.length === 0) {
        // First ensure we have product data
        createSampleProductsIfNeeded();
        
        const sampleOrders = [
            {
                id: 'ORD001',
                customerName: 'John Doe',
                customerEmail: 'john.doe@email.com',
                items: [
                    { 
                        name: 'Smart LED Bulb Set', 
                        quantity: 2, 
                        price: 79.99,
                        image_url: 'images/Smart LED Bulb Set.JPG',
                        category: 'Lighting'
                    },
                    { 
                        name: 'Smart Thermostat Pro', 
                        quantity: 1, 
                        price: 299.99,
                        image_url: 'images/Smart Thermostat Pro.JPG',
                        category: 'Climate'
                    }
                ],
                total: 459.97,
                paymentMethod: 'Credit Card',
                status: 'pending',
                date: new Date().toISOString(),
                shippingAddress: '123 Main St, Singapore 123456'
            },
            {
                id: 'ORD002',
                customerName: 'Jane Smith',
                customerEmail: 'jane.smith@email.com',
                items: [
                    { 
                        name: 'Smart Door Lock', 
                        quantity: 1, 
                        price: 199.99,
                        image_url: 'images/Smart Door Lock.JPG',
                        category: 'Security'
                    }
                ],
                total: 199.99,
                paymentMethod: 'PayPal',
                status: 'processing',
                date: new Date(Date.now() - 86400000).toISOString(),
                shippingAddress: '456 Oak Ave, Singapore 654321'
            },
            {
                id: 'ORD003',
                customerName: 'Mike Johnson',
                customerEmail: 'mike.johnson@email.com',
                items: [
                    { 
                        name: 'Smart Security Camera', 
                        quantity: 2, 
                        price: 149.99,
                        image_url: 'images/Smart Security Camera.JPG',
                        category: 'Security'
                    },
                    { 
                        name: 'Smart Motion Sensor', 
                        quantity: 3, 
                        price: 59.99,
                        image_url: 'images/Smart Motion Sensor.JPG',
                        category: 'Automation'
                    }
                ],
                total: 479.95,
                paymentMethod: 'Credit Card',
                status: 'shipped',
                date: new Date(Date.now() - 172800000).toISOString(),
                shippingAddress: '789 Pine St, Singapore 987654'
            },
            {
                id: 'ORD004',
                customerName: 'Sarah Wilson',
                customerEmail: 'sarah.wilson@email.com',
                items: [
                    { 
                        name: 'Smart Air Purifier', 
                        quantity: 1, 
                        price: 399.99,
                        image_url: 'images/Smart Air Purifier.PNG',
                        category: 'Climate'
                    }
                ],
                total: 399.99,
                paymentMethod: 'Credit Card',
                status: 'delivered',
                date: new Date(Date.now() - 259200000).toISOString(),
                shippingAddress: '321 Elm Dr, Singapore 456789'
            }
        ];
        
        localStorage.setItem('orders', JSON.stringify(sampleOrders));
    }
}

function showOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    let order = orders.find(o => o.id === orderId);
    
    if (!order) {
        showErrorAlert('Order not found!');
        return;
    }
    
    // Enrich the order with product information
    const enrichedOrders = enrichOrderItems([order]);
    order = enrichedOrders[0];
    
    const itemsHtml = order.items.map(item => `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.image_url || 'images/placeholder.png'}" 
                         alt="${item.name}" 
                         class="me-2 rounded" 
                         style="width: 40px; height: 40px; object-fit: cover;"
                         onerror="this.src='images/placeholder.png'">
                    <div>
                        <div class="fw-bold">${item.name}</div>
                        <small class="text-muted">${item.category || 'N/A'}</small>
                    </div>
                </div>
            </td>
            <td class="text-center">${item.quantity}</td>
            <td class="text-end">$${parseFloat(item.price).toFixed(2)}</td>
            <td class="text-end fw-bold">$${(item.quantity * item.price).toFixed(2)}</td>
        </tr>
    `).join('');
    
    const statusClass = order.status.toLowerCase();
    const orderDate = new Date(order.date).toLocaleDateString();
    
    const detailsHtml = `
        <div class="row">
            <div class="col-md-6">
                <div class="order-card p-4 mb-3">
                    <h6 class="fw-bold mb-3"><i class="fas fa-info-circle me-2"></i>Order Information</h6>
                    <p><strong>Order ID:</strong> #${order.id}</p>
                    <p><strong>Date:</strong> ${orderDate}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${statusClass}">${order.status}</span></p>
                    <p><strong>Payment:</strong> ${order.paymentMethod}</p>
                    <p><strong>Total:</strong> <strong class="text-success">$${parseFloat(order.total).toFixed(2)}</strong></p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="order-card p-4 mb-3">
                    <h6 class="fw-bold mb-3"><i class="fas fa-user me-2"></i>Customer Information</h6>
                    <p><strong>Name:</strong> ${order.customerName}</p>
                    <p><strong>Email:</strong> ${order.customerEmail}</p>
                    <p><strong>Address:</strong><br>${order.shippingAddress}</p>
                </div>
            </div>
        </div>
        <div class="order-card p-4">
            <h6 class="fw-bold mb-3"><i class="fas fa-shopping-bag me-2"></i>Order Items</h6>
            <div class="table-responsive">
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colspan="3" class="text-end">Grand Total:</th>
                            <th class="text-success">$${parseFloat(order.total).toFixed(2)}</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    `;
    
    $('#order-details-content').html(detailsHtml);
    $('#orderDetailsModal').modal('show');
    
    // Set up update status button
    $('#update-order-status').off('click').on('click', function() {
        $('#orderDetailsModal').modal('hide');
        setTimeout(() => showStatusUpdateModal(orderId), 300);
    });
}

function showStatusUpdateModal(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        showErrorAlert('Order not found!');
        return;
    }
    
    $('#update-order-id').val(orderId);
    $('#new-status').val(order.status);
    $('#status-note').val('');
    $('#statusUpdateModal').modal('show');
}

function updateOrderStatus(orderId, newStatus, note) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        orders[orderIndex].lastUpdated = new Date().toISOString();
        if (note) {
            orders[orderIndex].statusNote = note;
        }
        
        localStorage.setItem('orders', JSON.stringify(orders));
        updateOrderStats();
    }
}

function showAdminLoginPopup() {
    const loginModalHTML = `
        <div class="modal fade" id="adminLoginModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="border-radius: 20px; border: none; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); overflow: hidden;">
                    <div class="modal-header text-white border-0" style="background: var(--primary-gradient); padding: 2rem;">
                        <div class="text-center w-100">
                            <i class="fas fa-shield-alt fa-3x mb-3"></i>
                            <h4 class="modal-title fw-bold mb-2">Admin Access Required</h4>
                            <p class="mb-0 opacity-75">Secure login to Order Management</p>
                        </div>
                    </div>
                    <div class="modal-body p-4" style="background: rgba(255, 255, 255, 0.95);">
                        <div class="alert" style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); border: 1px solid rgba(102, 126, 234, 0.2); border-radius: 12px;">
                            <i class="fas fa-info-circle me-2 text-primary"></i>
                            Please enter admin credentials to access the order management system.
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
            
            localStorage.setItem('loggedInUser', JSON.stringify(adminUser));
            
            modal.hide();
            $('#adminLoginModal').remove();
            
            showSuccessAlert('Successfully logged in as Admin!');
            
            setTimeout(() => {
                initializeOrderDashboard();
            }, 500);
            
        } else {
            $('#login-error').removeClass('d-none');
            $('#admin-username, #admin-password').addClass('is-invalid');
            
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
    
    setTimeout(() => {
        $('.alert-success').alert('close');
    }, 3000);
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
    
    setTimeout(() => {
        $('.alert-danger').alert('close');
    }, 4000);
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('loggedInUser'));
}

function showAdminLoginPopup() {
    const loginModalHTML = `
        <div class="modal fade" id="adminLoginModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-shield-alt me-2"></i>Admin Access Required
                        </h5>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            Please enter admin credentials to access the order management system.
                        </div>
                        <form id="admin-login-form">
                            <div class="mb-3">
                                <label for="admin-username" class="form-label">Username</label>
                                <input type="text" class="form-control" id="admin-username" required>
                            </div>
                            <div class="mb-3">
                                <label for="admin-password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="admin-password" required>
                            </div>
                            <div class="alert alert-danger d-none" id="login-error">
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                Invalid credentials. Please try again.
                            </div>
                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-primary" id="login-submit">
                                    <i class="fas fa-sign-in-alt me-2"></i>Login
                                </button>
                                <button type="button" class="btn btn-outline-secondary" id="cancel-login">
                                    <i class="fas fa-times me-2"></i>Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('body').append(loginModalHTML);
    const modal = new bootstrap.Modal($('#adminLoginModal')[0]);
    modal.show();

    $('#admin-login-form').on('submit', function(e) {
        e.preventDefault();
        
        const username = $('#admin-username').val();
        const password = $('#admin-password').val();
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const adminUser = users.find(u => u.username === username && u.password === password && u.role === 'Admin');
        
        if (adminUser) {
            localStorage.setItem('currentUser', JSON.stringify(adminUser));
            modal.hide();
            $('#adminLoginModal').remove();
            showSuccessAlert('Successfully logged in as Admin!');
            setTimeout(initializeOrderManagement, 500);
        } else {
            $('#login-error').removeClass('d-none');
            $('#admin-username, #admin-password').addClass('is-invalid');
            
            setTimeout(() => {
                $('#login-error').addClass('d-none');
                $('#admin-username, #admin-password').removeClass('is-invalid');
            }, 3000);
        }
    });

    $('#cancel-login').on('click', function() {
        modal.hide();
        $('#adminLoginModal').remove();
        window.location.href = 'index.html';
    });

    $('#adminLoginModal').on('shown.bs.modal', function() {
        $('#admin-username').focus();
    });
}

function showSuccessAlert(message) {
    const alertHTML = `
        <div class="alert alert-success alert-dismissible fade show position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
            <i class="fas fa-check-circle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $('body').append(alertHTML);
    
    setTimeout(() => {
        $('.alert-success').alert('close');
    }, 3000);
}

function initializeOrderManagement() {
    const orderList = $('#order-list');
    let orders = JSON.parse(localStorage.getItem('orders')) || [];

    function renderOrders() {
        orderList.empty();
        
        if (orders.length === 0) {
            orderList.append(`
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                        <h5>No Orders Found</h5>
                        <p class="text-muted">Orders will appear here when customers place them.</p>
                    </td>
                </tr>
            `);
            return;
        }

        orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        
        orders.forEach((order, index) => {
            const total = order.totals ? order.totals.total : 
                         order.items.reduce((sum, item) => sum + (item.price || item.price_sgd || 0) * item.quantity, 0);
            const paymentMethod = order.paymentMethod === 'cash-on-delivery' ? 'COD' : 'Card';
            const orderDate = new Date(order.orderDate).toLocaleDateString();
            const statusClass = getStatusBadgeClass(order.status);
            
            const statusOptions = order.paymentMethod === 'cash-on-delivery' ? 
                ['Confirmed - Awaiting Payment', 'preparing', 'shipped', 'out-for-delivery', 'payment-collected', 'completed'] :
                ['Paid', 'preparing', 'shipped', 'completed'];

            let statusSelectOptions = '';
            statusOptions.forEach(status => {
                statusSelectOptions += `<option value="${status}" ${order.status === status ? 'selected' : ''}>${getStatusDisplayText(status)}</option>`;
            });

            orderList.append(`
                <tr>
                    <td>
                        <div class="d-flex flex-column">
                            <strong>${order.id}</strong>
                            <small class="text-muted">${orderDate}</small>
                        </div>
                    </td>
                    <td>
                        <div class="d-flex align-items-center">
                            <i class="fas fa-user-circle fa-lg text-primary me-2"></i>
                            <div>
                                <div>${order.user}</div>
                                <small class="text-muted">${order.billingInfo ? order.billingInfo.email : 'N/A'}</small>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="badge bg-info">${order.items.length} items</span>
                    </td>
                    <td>
                        <strong class="text-success">$${total.toFixed(2)}</strong>
                    </td>
                    <td>
                        <span class="badge ${paymentMethod === 'COD' ? 'bg-warning' : 'bg-primary'}">${paymentMethod}</span>
                    </td>
                    <td>
                        <select class="form-select form-select-sm order-status" data-order-id="${index}">
                            ${statusSelectOptions}
                        </select>
                    </td>
                    <td>
                        <div class="btn-group" role="group">
                            <button class="btn btn-sm btn-outline-info view-details" 
                                    data-order-id="${index}" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#orderDetailsModal"
                                    title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-order" 
                                    data-order-id="${index}"
                                    title="Delete Order">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `);
        });
    }

    function getStatusBadgeClass(status) {
        const statusClasses = {
            'Paid': 'bg-success',
            'Confirmed - Awaiting Payment': 'bg-warning',
            'preparing': 'bg-info',
            'shipped': 'bg-primary',
            'out-for-delivery': 'bg-warning',
            'payment-collected': 'bg-success',
            'completed': 'bg-success'
        };
        return statusClasses[status] || 'bg-secondary';
    }

    function getStatusDisplayText(status) {
        const statusMap = {
            'Paid': 'Paid',
            'Confirmed - Awaiting Payment': 'Order Confirmed',
            'preparing': 'Preparing',
            'shipped': 'Shipped',
            'out-for-delivery': 'Out for Delivery',
            'payment-collected': 'Payment Collected',
            'completed': 'Completed'
        };
        return statusMap[status] || status;
    }

    // Update order status
    orderList.on('change', '.order-status', function() {
        const orderId = $(this).data('order-id');
        const newStatus = $(this).val();
        orders[orderId].status = newStatus;
        orders[orderId].lastUpdated = new Date().toISOString();
        localStorage.setItem('orders', JSON.stringify(orders));
        showSuccessAlert('Order status updated successfully!');
    });

    // View order details
    orderList.on('click', '.view-details', function() {
        const orderId = $(this).data('order-id');
        let order = orders[orderId];
        const modalContent = $('#order-details-content');
        modalContent.empty();

        if (!order) {
            modalContent.html('<div class="alert alert-danger">Order not found</div>');
            return;
        }

        // Enrich the order with product information
        const enrichedOrders = enrichOrderItems([order]);
        order = enrichedOrders[0];

        const totals = order.totals || {
            subtotal: order.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0),
            tax: 0,
            shipping: 0,
            total: order.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
        };

        const itemsHtml = order.items.map(item => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${item.image_url || item.image || 'images/placeholder.png'}" 
                             alt="${item.name}" 
                             class="me-2 rounded" 
                             style="width: 40px; height: 40px; object-fit: cover;"
                             onerror="this.src='images/placeholder.png'">
                        <div>
                            <div class="fw-bold">${item.name}</div>
                            <small class="text-muted">${item.category || 'N/A'}</small>
                        </div>
                    </div>
                </td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-end">$${(item.price || 0).toFixed(2)}</td>
                <td class="text-end fw-bold">$${((item.price || 0) * item.quantity).toFixed(2)}</td>
            </tr>
        `).join('');

        const paymentInfo = order.paymentMethod === 'cash-on-delivery' ? 
            '<span class="badge bg-warning">Cash on Delivery</span>' :
            `<span class="badge bg-primary">Credit Card</span> (${order.paymentInfo ? order.paymentInfo.cardNumber : 'N/A'})`;

        const deliveryAddress = order.deliveryInfo && order.deliveryInfo.option === 'home-delivery' && order.deliveryInfo.address ? 
            `<div class="mt-2">
                <strong>Delivery Address:</strong><br>
                ${order.deliveryInfo.address.firstName} ${order.deliveryInfo.address.lastName}<br>
                ${order.deliveryInfo.address.address}<br>
                ${order.deliveryInfo.address.city}, ${order.deliveryInfo.address.state} ${order.deliveryInfo.address.zip}
                ${order.deliveryInfo.address.instructions ? '<br><strong>Instructions:</strong> ' + order.deliveryInfo.address.instructions : ''}
            </div>` : '';

        const detailsHtml = `
            <div class="row">
                <div class="col-md-6">
                    <h5 class="text-primary">Order Details</h5>
                    <table class="table table-borderless table-sm">
                        <tr><th>Order ID:</th><td>${order.id}</td></tr>
                        <tr><th>Customer:</th><td>${order.user}</td></tr>
                        <tr><th>Status:</th><td><span class="badge ${getStatusBadgeClass(order.status)}">${getStatusDisplayText(order.status)}</span></td></tr>
                        <tr><th>Order Date:</th><td>${new Date(order.orderDate).toLocaleString()}</td></tr>
                        <tr><th>Payment:</th><td>${paymentInfo}</td></tr>
                    </table>
                </div>
                <div class="col-md-6">
                    <h5 class="text-primary">Contact Information</h5>
                    <table class="table table-borderless table-sm">
                        <tr><th>Name:</th><td>${order.billingInfo ? order.billingInfo.firstName + ' ' + order.billingInfo.lastName : 'N/A'}</td></tr>
                        <tr><th>Email:</th><td>${order.billingInfo ? order.billingInfo.email : 'N/A'}</td></tr>
                        <tr><th>Phone:</th><td>${order.billingInfo ? order.billingInfo.phone : 'N/A'}</td></tr>
                        <tr><th>Delivery:</th><td>${order.deliveryInfo ? (order.deliveryInfo.option === 'home-delivery' ? 'Home Delivery' : 'Self Collection') : 'N/A'}</td></tr>
                    </table>
                </div>
            </div>

            <hr>

            <h5 class="text-primary">Order Items</h5>
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead class="table-light">
                        <tr>
                            <th>Product</th>
                            <th class="text-center">Quantity</th>
                            <th class="text-end">Price</th>
                            <th class="text-end">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                    <tfoot class="table-light">
                        <tr>
                            <td colspan="3" class="text-end"><strong>Subtotal:</strong></td>
                            <td class="text-end"><strong>$${totals.subtotal.toFixed(2)}</strong></td>
                        </tr>
                        <tr>
                            <td colspan="3" class="text-end"><strong>Tax:</strong></td>
                            <td class="text-end"><strong>$${totals.tax.toFixed(2)}</strong></td>
                        </tr>
                        <tr>
                            <td colspan="3" class="text-end"><strong>Shipping:</strong></td>
                            <td class="text-end"><strong>${totals.shipping === 0 ? 'FREE' : '$' + totals.shipping.toFixed(2)}</strong></td>
                        </tr>
                        <tr class="table-success">
                            <td colspan="3" class="text-end"><strong>Total:</strong></td>
                            <td class="text-end"><strong>$${totals.total.toFixed(2)}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <hr>

            <div class="row">
                <div class="col-md-6">
                    <h6 class="text-primary">Billing Address</h6>
                    <address>
                        ${order.billingInfo ? order.billingInfo.firstName + ' ' + order.billingInfo.lastName : 'N/A'}<br>
                        ${order.billingInfo ? order.billingInfo.address : 'N/A'}<br>
                        ${order.billingInfo ? order.billingInfo.city + ', ' + order.billingInfo.state + ' ' + order.billingInfo.zip : 'N/A'}
                    </address>
                </div>
                <div class="col-md-6">
                    <h6 class="text-primary">Delivery Information</h6>
                    <div>
                        <strong>Method:</strong> ${order.deliveryInfo ? (order.deliveryInfo.option === 'home-delivery' ? 'Home Delivery' : 'Self Collection') : 'N/A'}
                        ${deliveryAddress}
                    </div>
                </div>
            </div>
        `;

        modalContent.html(detailsHtml);
    });

    // Delete order
    orderList.on('click', '.delete-order', function() {
        const orderId = $(this).data('order-id');
        const order = orders[orderId];
        
        if (confirm(`Are you sure you want to delete order ${order.id}?`)) {
            orders.splice(orderId, 1);
            localStorage.setItem('orders', JSON.stringify(orders));
            renderOrders();
            showSuccessAlert('Order deleted successfully!');
        }
    });

    renderOrders();
}

// Analytics Functions
let salesChart, orderStatusChart, monthlyRevenueChart, topProductsChart;

function initializeAnalytics() {
    updateAnalyticsStats();
    initializeCharts();
    
    // Update charts when period changes
    $('#sales-chart-period').change(function() {
        updateSalesChart();
    });
}

function updateAnalyticsStats() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Calculate stats
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const pendingOrders = orders.filter(order => order.status === 'Pending').length;
    
    // Update displays
    $('#total-orders-count').text(totalOrders);
    $('#total-revenue').text(`$${totalRevenue.toLocaleString()}`);
    $('#avg-order-value').text(`$${avgOrderValue.toFixed(2)}`);
    $('#pending-orders').text(pendingOrders);
    
    // Calculate performance metrics
    const completedOrders = orders.filter(order => order.status === 'Delivered').length;
    const completionRate = totalOrders > 0 ? (completedOrders / totalOrders * 100).toFixed(1) : 0;
    const returnRate = Math.random() * 5; // Simulated return rate
    
    $('#completion-rate-text').text(`${completionRate}%`);
    $('#completion-rate-bar').css('width', `${completionRate}%`);
    $('#return-rate-text').text(`${returnRate.toFixed(1)}%`);
    $('#return-rate-bar').css('width', `${returnRate}%`);
}

function initializeCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        salesChart = new Chart(salesCtx, {
            type: 'line',
            data: getSalesChartData(),
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
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
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
    
    // Monthly Revenue Chart
    const monthlyCtx = document.getElementById('monthlyRevenueChart');
    if (monthlyCtx) {
        monthlyRevenueChart = new Chart(monthlyCtx, {
            type: 'bar',
            data: getMonthlyRevenueData(),
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
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Top Products Chart
    const productsCtx = document.getElementById('topProductsChart');
    if (productsCtx) {
        topProductsChart = new Chart(productsCtx, {
            type: 'bar',
            data: getTopProductsData(),
            options: {
                responsive: true,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function getSalesChartData() {
    const period = parseInt($('#sales-chart-period').val()) || 30;
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    const labels = [];
    const data = [];
    const today = new Date();
    
    for (let i = period - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        const dayRevenue = orders
            .filter(order => {
                const orderDate = new Date(order.date || order.orderDate);
                return orderDate.toISOString().split('T')[0] === dateStr;
            })
            .reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
        
        data.push(dayRevenue);
    }
    
    return {
        labels: labels,
        datasets: [{
            label: 'Revenue',
            data: data,
            borderColor: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
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
    
    // If no orders, show empty state
    if (Object.keys(statusCounts).length === 0) {
        statusCounts['No Orders'] = 1;
    }
    
    const colors = {
        'Pending': '#ffc107',
        'Processing': '#17a2b8',
        'Shipped': '#007bff',
        'Delivered': '#28a745',
        'Cancelled': '#dc3545',
        'No Orders': '#e9ecef'
    };
    
    return {
        labels: Object.keys(statusCounts),
        datasets: [{
            data: Object.values(statusCounts),
            backgroundColor: Object.keys(statusCounts).map(status => colors[status] || '#6c757d')
        }]
    };
}

function getMonthlyRevenueData() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const monthlyData = {};
    
    orders.forEach(order => {
        const date = new Date(order.date || order.orderDate);
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + (parseFloat(order.total) || 0);
    });
    
    // If no data, show current month with 0
    if (Object.keys(monthlyData).length === 0) {
        const currentMonth = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        monthlyData[currentMonth] = 0;
    }
    
    return {
        labels: Object.keys(monthlyData),
        datasets: [{
            data: Object.values(monthlyData),
            backgroundColor: '#007bff'
        }]
    };
}

function getTopProductsData() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const productCounts = {};
    
    orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                const productName = item.name || 'Unknown Product';
                productCounts[productName] = (productCounts[productName] || 0) + (item.quantity || 1);
            });
        }
    });
    
    // Get top 5 products
    const sortedProducts = Object.entries(productCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    return {
        labels: sortedProducts.map(item => item[0]),
        datasets: [{
            data: sortedProducts.map(item => item[1]),
            backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8']
        }]
    };
}

function updateSalesChart() {
    if (salesChart) {
        salesChart.data = getSalesChartData();
        salesChart.update();
    }
}

// Reports Functions
function initializeReports() {
    // Set default dates
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    $('#date-to').val(today.toISOString().split('T')[0]);
    $('#date-from').val(lastMonth.toISOString().split('T')[0]);
}

function previewReport() {
    const reportType = $('#report-type').val();
    const dateFrom = $('#date-from').val();
    const dateTo = $('#date-to').val();
    
    const orders = getFilteredOrders(reportType, dateFrom, dateTo);
    renderReportPreview(orders);
    
    // Update summary
    const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
    $('#report-summary').text(`${orders.length} orders found | Total Revenue: $${totalRevenue.toLocaleString()}`);
}

function getFilteredOrders(reportType, dateFrom, dateTo) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Filter by type
    if (reportType !== 'all') {
        if (reportType === 'revenue') {
            // Revenue report shows all orders
        } else {
            orders = orders.filter(order => order.status.toLowerCase() === reportType);
        }
    }
    
    // Filter by date range
    if (dateFrom && dateTo) {
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999); // Include full end date
        
        orders = orders.filter(order => {
            const orderDate = new Date(order.date || order.orderDate);
            return orderDate >= fromDate && orderDate <= toDate;
        });
    }
    
    return orders;
}

function renderReportPreview(orders) {
    const tbody = $('#report-preview-body');
    tbody.empty();
    
    if (orders.length === 0) {
        tbody.html('<tr><td colspan="6" class="text-center text-muted">No orders found for the selected criteria</td></tr>');
        return;
    }
    
    orders.forEach(order => {
        const productNames = order.items && Array.isArray(order.items) 
            ? order.items.map(item => item.name).join(', ')
            : 'N/A';
        
        const row = `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${new Date(order.date || order.orderDate).toLocaleDateString()}</td>
                <td><span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></td>
                <td>$${parseFloat(order.total || 0).toFixed(2)}</td>
                <td>${productNames}</td>
            </tr>
        `;
        tbody.append(row);
    });
}

function getStatusColor(status) {
    switch(status) {
        case 'Delivered': return 'success';
        case 'Pending': return 'warning';
        case 'Processing': return 'info';
        case 'Shipped': return 'primary';
        case 'Cancelled': return 'danger';
        default: return 'secondary';
    }
}

function generatePDFReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const reportType = $('#report-type').val();
    const dateFrom = $('#date-from').val();
    const dateTo = $('#date-to').val();
    const orders = getFilteredOrders(reportType, dateFrom, dateTo);
    
    // Add title
    doc.setFontSize(20);
    doc.text('EzHome Order Report', 20, 20);
    
    // Add report info
    doc.setFontSize(12);
    doc.text(`Report Type: ${reportType.toUpperCase()}`, 20, 35);
    doc.text(`Date Range: ${dateFrom} to ${dateTo}`, 20, 45);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 55);
    
    // Prepare table data
    const tableData = orders.map(order => [
        order.id,
        order.customer,
        new Date(order.date || order.orderDate).toLocaleDateString(),
        order.status,
        `$${parseFloat(order.total || 0).toFixed(2)}`
    ]);
    
    // Add table
    doc.autoTable({
        head: [['Order ID', 'Customer', 'Date', 'Status', 'Total']],
        body: tableData,
        startY: 65,
        theme: 'striped',
        headStyles: { fillColor: [102, 126, 234] },
        styles: { fontSize: 10 }
    });
    
    // Add summary
    const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0);
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Total Orders: ${orders.length}`, 20, finalY);
    doc.text(`Total Revenue: $${totalRevenue.toLocaleString()}`, 20, finalY + 10);
    
    // Save the PDF
    doc.save(`ezhome-orders-report-${new Date().toISOString().split('T')[0]}.pdf`);
    showSuccessAlert('PDF report generated successfully!');
}

function generateCSVReport() {
    const reportType = $('#report-type').val();
    const dateFrom = $('#date-from').val();
    const dateTo = $('#date-to').val();
    const orders = getFilteredOrders(reportType, dateFrom, dateTo);
    
    // CSV headers
    let csvContent = 'Order ID,Customer,Date,Status,Total,Products\n';
    
    // Add data rows
    orders.forEach(order => {
        const productNames = order.items && Array.isArray(order.items) 
            ? order.items.map(item => item.name).join('; ')
            : '';
        
        const row = [
            order.id,
            `"${order.customer}"`,
            new Date(order.date || order.orderDate).toLocaleDateString(),
            order.status,
            parseFloat(order.total || 0).toFixed(2),
            `"${productNames}"`
        ].join(',');
        
        csvContent += row + '\n';
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ezhome-orders-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    
    showSuccessAlert('CSV report generated successfully!');
}

function generateExcelReport() {
    // For Excel, we'll generate a CSV file with Excel-friendly format
    generateCSVReport();
    showSuccessAlert('Excel-compatible CSV report generated successfully!');
}

function generateQuickReport(period) {
    const today = new Date();
    let fromDate, toDate;
    
    switch(period) {
        case 'daily':
            fromDate = toDate = today.toISOString().split('T')[0];
            break;
        case 'weekly':
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            fromDate = weekAgo.toISOString().split('T')[0];
            toDate = today.toISOString().split('T')[0];
            break;
        case 'monthly':
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            fromDate = monthAgo.toISOString().split('T')[0];
            toDate = today.toISOString().split('T')[0];
            break;
    }
    
    $('#date-from').val(fromDate);
    $('#date-to').val(toDate);
    $('#report-type').val('all');
    
    previewReport();
    generatePDFReport();
}

function refreshReportData() {
    previewReport();
    updateAnalyticsStats();
    if (salesChart) salesChart.update();
    if (orderStatusChart) orderStatusChart.update();
    if (monthlyRevenueChart) monthlyRevenueChart.update();
    if (topProductsChart) topProductsChart.update();
    
    showSuccessAlert('Report data refreshed successfully!');
}
