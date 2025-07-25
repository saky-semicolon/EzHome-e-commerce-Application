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

    initializeOrderManagement();
});

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
        const order = orders[orderId];
        const modalContent = $('#order-details-content');
        modalContent.empty();

        if (!order) {
            modalContent.html('<div class="alert alert-danger">Order not found</div>');
            return;
        }

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
                        <img src="${item.image_url || 'images/default-product.jpg'}" 
                             alt="${item.name}" 
                             class="me-2 rounded" 
                             style="width: 40px; height: 40px; object-fit: cover;">
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

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}
