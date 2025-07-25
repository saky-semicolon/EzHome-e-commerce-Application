$(document).ready(function() {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        showNotLoggedIn();
        return;
    }
    
    // Initialize profile page
    initializeProfile(currentUser);
    loadUserOrders(currentUser.username);
});

function getCurrentUser() {
    const currentUserData = localStorage.getItem('currentUser');
    return currentUserData ? JSON.parse(currentUserData) : null;
}

function showNotLoggedIn() {
    $('#profile-content').html(`
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="text-center py-5">
                    <i class="fas fa-user-slash fa-4x text-muted mb-4"></i>
                    <h2>Please Log In</h2>
                    <p class="text-muted mb-4">You need to be logged in to view your profile.</p>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#loginModal">
                        <i class="fas fa-sign-in-alt me-2"></i>Login
                    </button>
                    <a href="index.html" class="btn btn-outline-secondary ms-2">
                        <i class="fas fa-home me-2"></i>Back to Home
                    </a>
                </div>
            </div>
        </div>
    `);
}

function initializeProfile(user) {
    const orderCount = getOrderCount(user.username);
    const totalSpent = getTotalSpent(user.username);
    
    $('#profile-content').html(`
        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0">
                            <i class="fas fa-user me-2"></i>Profile Information
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="text-center mb-4">
                            <div class="profile-avatar bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style="width: 80px; height: 80px; font-size: 2rem;">
                                ${user.username.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <table class="table table-borderless">
                            <tr>
                                <td><strong>Username:</strong></td>
                                <td>${user.username}</td>
                            </tr>
                            <tr>
                                <td><strong>Email:</strong></td>
                                <td>${user.email}</td>
                            </tr>
                            <tr>
                                <td><strong>Phone:</strong></td>
                                <td>${user.phone || 'Not provided'}</td>
                            </tr>
                            <tr>
                                <td><strong>Address:</strong></td>
                                <td>${user.address || 'Not provided'}</td>
                            </tr>
                            <tr>
                                <td><strong>Role:</strong></td>
                                <td><span class="badge ${user.role === 'Admin' ? 'bg-danger' : 'bg-success'}">${user.role || 'Customer'}</span></td>
                            </tr>
                        </table>
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-primary" id="edit-profile-btn">
                                <i class="fas fa-edit me-2"></i>Edit Profile
                            </button>
                            <button class="btn btn-outline-secondary" id="logout-btn">
                                <i class="fas fa-sign-out-alt me-2"></i>Logout
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="card mt-4">
                    <div class="card-header bg-success text-white">
                        <h5 class="mb-0">
                            <i class="fas fa-chart-line me-2"></i>Account Summary
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="row text-center">
                            <div class="col-6">
                                <h4 class="text-primary">${orderCount}</h4>
                                <small class="text-muted">Total Orders</small>
                            </div>
                            <div class="col-6">
                                <h4 class="text-success">$${totalSpent.toFixed(2)}</h4>
                                <small class="text-muted">Total Spent</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header bg-info text-white">
                        <h5 class="mb-0">
                            <i class="fas fa-shopping-bag me-2"></i>Order History
                        </h5>
                    </div>
                    <div class="card-body">
                        <div id="user-orders">
                            <!-- Orders will be populated here -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
    
    // Bind event handlers
    bindProfileEvents(user);
}

function bindProfileEvents(user) {
    // Logout button
    $('#logout-btn').on('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        }
    });
    
    // Edit profile button
    $('#edit-profile-btn').on('click', function() {
        showEditProfileModal(user);
    });
}

function showEditProfileModal(user) {
    const modalHtml = `
        <div class="modal fade" id="editProfileModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Profile</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="edit-profile-form">
                            <div class="mb-3">
                                <label for="edit-email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="edit-email" value="${user.email}" required>
                            </div>
                            <div class="mb-3">
                                <label for="edit-phone" class="form-label">Phone</label>
                                <input type="tel" class="form-control" id="edit-phone" value="${user.phone || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label for="edit-address" class="form-label">Address</label>
                                <textarea class="form-control" id="edit-address" rows="3" required>${user.address || ''}</textarea>
                            </div>
                            <div class="mb-3">
                                <label for="edit-password" class="form-label">New Password (leave blank to keep current)</label>
                                <input type="password" class="form-control" id="edit-password">
                            </div>
                            <div class="mb-3">
                                <label for="edit-confirm-password" class="form-label">Confirm New Password</label>
                                <input type="password" class="form-control" id="edit-confirm-password">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="save-profile-btn">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modalHtml);
    $('#editProfileModal').modal('show');
    
    // Handle modal cleanup
    $('#editProfileModal').on('hidden.bs.modal', function() {
        $(this).remove();
    });
    
    // Handle save
    $('#save-profile-btn').on('click', function() {
        const newPassword = $('#edit-password').val();
        const confirmPassword = $('#edit-confirm-password').val();
        
        if (newPassword && newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Update user data
        const updatedUser = {
            ...user,
            email: $('#edit-email').val(),
            phone: $('#edit-phone').val(),
            address: $('#edit-address').val()
        };
        
        if (newPassword) {
            updatedUser.password = newPassword;
        }
        
        // Update in localStorage
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.username === user.username);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
        
        $('#editProfileModal').modal('hide');
        alert('Profile updated successfully!');
        window.location.reload();
    });
}

function loadUserOrders(username) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = orders.filter(order => order.user === username);
    
    if (userOrders.length === 0) {
        $('#user-orders').html(`
            <div class="text-center py-4">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <h5>No Orders Yet</h5>
                <p class="text-muted">You haven't placed any orders yet.</p>
                <a href="index.html" class="btn btn-primary">Start Shopping</a>
            </div>
        `);
        return;
    }
    
    // Sort orders by date (newest first)
    userOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    
    let ordersHtml = '';
    userOrders.forEach(order => {
        const orderDate = new Date(order.orderDate).toLocaleDateString();
        const statusClass = getStatusClass(order.status);
        const paymentMethod = order.paymentMethod === 'cash-on-delivery' ? 'Cash on Delivery' : 'Credit Card';
        const isCompleted = ['completed', 'payment-collected'].includes(order.status);
        
        // Generate items list with rating options for completed orders
        let itemsHtml = '';
        if (order.items && order.items.length > 0) {
            itemsHtml = order.items.map(item => {
                const userRating = window.ratingManager ? window.ratingManager.getUserRating(item.id, username) : null;
                const canRate = isCompleted && window.ratingManager && window.ratingManager.canUserRate(item.id, username);
                
                let ratingSection = '';
                if (isCompleted) {
                    if (userRating) {
                        ratingSection = `
                            <div class="mt-2">
                                <small class="text-muted">Your rating: </small>
                                ${window.ratingManager.generateStarDisplay(userRating.rating)}
                                <button class="btn btn-sm btn-outline-secondary ms-2" onclick="editRating(${item.id}, '${username}')">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                            </div>
                        `;
                    } else if (canRate) {
                        ratingSection = `
                            <div class="mt-2">
                                <button class="btn btn-sm btn-outline-warning" onclick="showRatingModal(${item.id}, '${item.name}', '${username}')">
                                    <i class="fas fa-star"></i> Rate this product
                                </button>
                            </div>
                        `;
                    }
                }
                
                return `
                    <div class="d-flex align-items-center mb-2 p-2 border rounded">
                        <img src="${item.image_url || 'images/default-product.jpg'}" alt="${item.name}" 
                             style="width: 50px; height: 50px; object-fit: cover;" class="rounded me-3">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">${item.name}</h6>
                            <small class="text-muted">Qty: ${item.quantity} × $${(item.price || 0).toFixed(2)}</small>
                            ${ratingSection}
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        ordersHtml += `
            <div class="card mb-3">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <strong>Order #${order.id}</strong>
                        <small class="text-muted ms-2">${orderDate}</small>
                    </div>
                    <div>
                        <span class="badge ${statusClass}">${order.status}</span>
                        <button class="btn btn-sm btn-outline-primary ms-2" onclick="viewOrderDetails('${order.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-8">
                            <p class="mb-1"><strong>Items:</strong> ${order.items.length} item(s)</p>
                            <p class="mb-1"><strong>Payment:</strong> ${paymentMethod}</p>
                            <p class="mb-2"><strong>Delivery:</strong> ${order.deliveryInfo.option === 'home-delivery' ? 'Home Delivery' : 'Self Collection'}</p>
                            
                            ${isCompleted ? `
                                <div class="mt-3">
                                    <h6 class="text-primary">Order Items:</h6>
                                    ${itemsHtml}
                                </div>
                            ` : ''}
                        </div>
                        <div class="col-md-4 text-end">
                            <h5 class="text-success mb-0">$${order.totals.total.toFixed(2)}</h5>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    $('#user-orders').html(ordersHtml);
}

function getOrderCount(username) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    return orders.filter(order => order.user === username).length;
}

function getTotalSpent(username) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = orders.filter(order => order.user === username);
    return userOrders.reduce((total, order) => total + order.totals.total, 0);
}

function getStatusClass(status) {
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

function viewOrderDetails(orderId) {
    // Redirect to order status page
    window.location.href = `order-status.html?order=${orderId}`;
}

// Rating functions
function showRatingModal(productId, productName, username) {
    const modalHtml = `
        <div class="modal fade" id="ratingModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-star text-warning me-2"></i>Rate Product
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-4">
                            <h6>${productName}</h6>
                            <p class="text-muted">How was your experience with this product?</p>
                        </div>
                        
                        <div class="text-center mb-4">
                            <div id="rating-stars" class="mb-3">
                                ${window.ratingManager.generateInteractiveStars(0, productId)}
                            </div>
                            <div id="rating-text" class="text-muted">Click to rate</div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="rating-review" class="form-label">Write a review (optional)</label>
                            <textarea class="form-control" id="rating-review" rows="4" 
                                    placeholder="Share your thoughts about this product..."></textarea>
                        </div>
                        
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            Your rating will help other customers make informed decisions.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-warning" id="submit-rating-btn" disabled>
                            <i class="fas fa-star me-1"></i>Submit Rating
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modalHtml);
    $('#ratingModal').modal('show');
    
    let selectedRating = 0;
    
    // Handle star click
    $('.rating-input-star').on('click', function() {
        selectedRating = parseInt($(this).data('rating'));
        updateStarDisplay(selectedRating);
        updateRatingText(selectedRating);
        $('#submit-rating-btn').prop('disabled', false);
    });
    
    // Handle star hover
    $('.rating-input-star').on('mouseenter', function() {
        const hoverRating = parseInt($(this).data('rating'));
        updateStarDisplay(hoverRating);
    });
    
    // Handle mouse leave
    $('#rating-stars').on('mouseleave', function() {
        updateStarDisplay(selectedRating);
    });
    
    // Submit rating
    $('#submit-rating-btn').on('click', function() {
        const review = $('#rating-review').val().trim();
        
        if (window.ratingManager.addRating(productId, username, selectedRating, review)) {
            $('#ratingModal').modal('hide');
            showSuccessMessage('Thank you for your rating!');
            setTimeout(() => {
                location.reload(); // Refresh to show the new rating
            }, 1500);
        } else {
            alert('Error submitting rating. Please try again.');
        }
    });
    
    // Cleanup on modal close
    $('#ratingModal').on('hidden.bs.modal', function() {
        $(this).remove();
    });
    
    function updateStarDisplay(rating) {
        $('.rating-input-star').each(function(index) {
            const starRating = index + 1;
            if (starRating <= rating) {
                $(this).removeClass('text-muted').addClass('text-warning');
            } else {
                $(this).removeClass('text-warning').addClass('text-muted');
            }
        });
    }
    
    function updateRatingText(rating) {
        const ratingTexts = {
            1: 'Poor',
            2: 'Fair', 
            3: 'Good',
            4: 'Very Good',
            5: 'Excellent'
        };
        $('#rating-text').text(ratingTexts[rating] || 'Click to rate');
    }
}

function editRating(productId, username) {
    const currentRating = window.ratingManager.getUserRating(productId, username);
    const product = window.products.find(p => p.id == productId);
    
    if (!currentRating || !product) {
        alert('Error loading rating data.');
        return;
    }
    
    const modalHtml = `
        <div class="modal fade" id="editRatingModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-edit text-primary me-2"></i>Edit Rating
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-4">
                            <h6>${product.name}</h6>
                            <p class="text-muted">Update your rating and review</p>
                        </div>
                        
                        <div class="text-center mb-4">
                            <div id="edit-rating-stars" class="mb-3">
                                ${window.ratingManager.generateInteractiveStars(currentRating.rating, productId)}
                            </div>
                            <div id="edit-rating-text" class="text-muted">${getRatingText(currentRating.rating)}</div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="edit-rating-review" class="form-label">Review</label>
                            <textarea class="form-control" id="edit-rating-review" rows="4" 
                                    placeholder="Share your thoughts about this product...">${currentRating.review || ''}</textarea>
                        </div>
                        
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            This will update your previous rating.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="update-rating-btn">
                            <i class="fas fa-save me-1"></i>Update Rating
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(modalHtml);
    $('#editRatingModal').modal('show');
    
    let selectedRating = currentRating.rating;
    updateEditStarDisplay(selectedRating);
    
    // Handle star click
    $('.rating-input-star').on('click', function() {
        selectedRating = parseInt($(this).data('rating'));
        updateEditStarDisplay(selectedRating);
        updateEditRatingText(selectedRating);
    });
    
    // Handle star hover
    $('.rating-input-star').on('mouseenter', function() {
        const hoverRating = parseInt($(this).data('rating'));
        updateEditStarDisplay(hoverRating);
    });
    
    // Handle mouse leave
    $('#edit-rating-stars').on('mouseleave', function() {
        updateEditStarDisplay(selectedRating);
    });
    
    // Update rating
    $('#update-rating-btn').on('click', function() {
        const review = $('#edit-rating-review').val().trim();
        
        if (window.ratingManager.addRating(productId, username, selectedRating, review)) {
            $('#editRatingModal').modal('hide');
            showSuccessMessage('Rating updated successfully!');
            setTimeout(() => {
                location.reload(); // Refresh to show the updated rating
            }, 1500);
        } else {
            alert('Error updating rating. Please try again.');
        }
    });
    
    // Cleanup on modal close
    $('#editRatingModal').on('hidden.bs.modal', function() {
        $(this).remove();
    });
    
    function updateEditStarDisplay(rating) {
        $('.rating-input-star').each(function(index) {
            const starRating = index + 1;
            if (starRating <= rating) {
                $(this).removeClass('text-muted').addClass('text-warning');
            } else {
                $(this).removeClass('text-warning').addClass('text-muted');
            }
        });
    }
    
    function updateEditRatingText(rating) {
        $('#edit-rating-text').text(getRatingText(rating));
    }
}

function getRatingText(rating) {
    const ratingTexts = {
        1: 'Poor',
        2: 'Fair', 
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
    };
    return ratingTexts[rating] || 'Not rated';
}

function showSuccessMessage(message) {
    const alertHtml = `
        <div class="alert alert-success alert-dismissible fade show position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
            <i class="fas fa-check-circle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $('body').append(alertHtml);
    
    setTimeout(() => {
        $('.alert-success').alert('close');
    }, 3000);
}
