$(document).ready(function() {
    // Get order from URL parameter or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order');
    
    let order = null;
    
    // Try to get current order first (for immediate redirect from checkout)
    if (localStorage.getItem('currentOrder')) {
        order = JSON.parse(localStorage.getItem('currentOrder'));
        localStorage.removeItem('currentOrder'); // Remove after use
    } 
    // Otherwise, try to find order by ID in orders history
    else if (orderId) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        order = orders.find(o => o.id === orderId);
    }

    if (!order) {
        displayNoOrderFound();
        return;
    }

    // Display order information
    displayOrderInfo(order);
    displayOrderItems(order);
    displayOrderTotals(order);
    displayShippingInfo(order);
    displayOrderTimeline(order);
    
    // Simulate order status progression for demo
    simulateOrderProgress(order);
});

function displayNoOrderFound() {
    $('#order-info').html(`
        <div class="text-center py-5">
            <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h3>Order Not Found</h3>
            <p class="text-muted">We couldn't find the order you're looking for.</p>
            <a href="index.html" class="btn btn-primary">Return to Home</a>
        </div>
    `);
}

function displayOrderInfo(order) {
    const orderDate = new Date(order.orderDate).toLocaleString();
    const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString();
    
    $('#order-info').html(`
        <div class="row">
            <div class="col-md-6">
                <h6 class="text-muted">Order Number</h6>
                <p class="fw-bold">${order.id}</p>
            </div>
            <div class="col-md-6">
                <h6 class="text-muted">Order Date</h6>
                <p>${orderDate}</p>
            </div>
            <div class="col-md-6">
                <h6 class="text-muted">Order Status</h6>
                <span class="badge bg-success fs-6">${getStatusDisplay(order.status)}</span>
            </div>
            <div class="col-md-6">
                <h6 class="text-muted">Estimated Delivery</h6>
                <p>${estimatedDelivery}</p>
            </div>
        </div>
    `);
    
    $('#order-placed-time').text(orderDate);
}

function displayOrderItems(order) {
    $('#order-items').empty();
    
    order.items.forEach(item => {
        const itemHtml = `
            <div class="order-item border-bottom pb-3 mb-3">
                <div class="row align-items-center">
                    <div class="col-2">
                        <img src="${item.image_url}" alt="${item.name}" class="img-fluid rounded" style="max-height: 80px; object-fit: cover;">
                    </div>
                    <div class="col-6">
                        <h6 class="mb-1">${item.name}</h6>
                        <p class="text-muted mb-1">${item.category}</p>
                        <small class="text-muted">Quantity: ${item.quantity}</small>
                    </div>
                    <div class="col-2 text-center">
                        <span class="fw-bold">$${item.price.toFixed(2)}</span>
                        <br>
                        <small class="text-muted">each</small>
                    </div>
                    <div class="col-2 text-end">
                        <span class="fw-bold text-success">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
        $('#order-items').append(itemHtml);
    });
}

function displayOrderTotals(order) {
    const totals = order.totals;
    const isCOD = order.paymentMethod === 'cash-on-delivery';
    
    $('#order-totals').html(`
        <div class="row">
            <div class="col-md-8 offset-md-4">
                <div class="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>$${totals.subtotal.toFixed(2)}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span>Tax (8%):</span>
                    <span>$${totals.tax.toFixed(2)}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span>Shipping:</span>
                    <span>${totals.shipping === 0 ? 'FREE' : '$' + totals.shipping.toFixed(2)}</span>
                </div>
                <hr>
                <div class="d-flex justify-content-between fw-bold fs-5">
                    <span>${isCOD ? 'Total Amount:' : 'Total Paid:'}:</span>
                    <span class="${isCOD ? 'text-warning' : 'text-success'}">$${totals.total.toFixed(2)}</span>
                </div>
                <div class="d-flex justify-content-between mt-2">
                    <span>Payment Method:</span>
                    <span>${isCOD ? 'Cash on Delivery' : 'Card ending in ' + order.paymentInfo.cardNumber}</span>
                </div>
                ${isCOD ? `
                <div class="alert alert-warning mt-3">
                    <i class="fas fa-money-bill-wave me-2"></i>
                    <strong>Payment Due on Delivery</strong><br>
                    Please have the exact amount ready when your order arrives.
                </div>
                ` : ''}
            </div>
        </div>
    `);
}

function displayShippingInfo(order) {
    const billing = order.billingInfo;
    
    $('#shipping-info').html(`
        <div class="row">
            <div class="col-md-6">
                <h6 class="text-muted">Shipping Address</h6>
                <address>
                    ${billing.firstName} ${billing.lastName}<br>
                    ${billing.address}<br>
                    ${billing.city}, ${billing.state} ${billing.zip}<br>
                    <abbr title="Phone">P:</abbr> ${billing.phone}
                </address>
            </div>
            <div class="col-md-6">
                <h6 class="text-muted">Shipping Method</h6>
                <p>${order.totals.shipping === 0 ? 'Free Standard Shipping' : 'Standard Shipping'}</p>
                <p class="text-muted">5-7 business days</p>
                
                <h6 class="text-muted mt-3">Tracking</h6>
                <p class="text-muted">Tracking information will be provided once your order ships.</p>
            </div>
        </div>
    `);
}

function displayOrderTimeline(order) {
    // This would typically be driven by real order status updates
    const status = order.status || 'paid';
    
    // Update timeline based on current status
    updateTimelineStatus(status);
}

function updateTimelineStatus(status) {
    const timelineItems = $('.timeline-item');
    const statusMap = {
        'paid': 1,
        'preparing': 2,
        'shipped': 3,
        'completed': 4
    };
    
    const currentStep = statusMap[status] || 1;
    
    timelineItems.each(function(index) {
        if (index < currentStep) {
            $(this).addClass('active');
            $(this).find('.timeline-marker').removeClass('bg-secondary').addClass('bg-success');
        }
    });
}

function getStatusDisplay(status) {
    const statusMap = {
        'Paid': 'Payment Confirmed',
        'Confirmed - Awaiting Payment': 'Order Confirmed',
        'preparing': 'Preparing for Shipment',
        'shipped': 'Shipped',
        'out-for-delivery': 'Out for Delivery',
        'payment-collected': 'Payment Collected',
        'completed': 'Delivered'
    };
    
    return statusMap[status] || status;
}

function simulateOrderProgress(order) {
    // Simulate order status progression for demo purposes
    let currentStatus = order.status;
    const isCOD = order.paymentMethod === 'cash-on-delivery';
    
    // Different progress steps for COD vs Credit Card orders
    const progressSteps = isCOD ? [
        { status: 'Confirmed - Awaiting Payment', delay: 0 },
        { status: 'preparing', delay: 3000 },
        { status: 'shipped', delay: 6000 },
        { status: 'out-for-delivery', delay: 9000 },
        { status: 'payment-collected', delay: 12000 },
        { status: 'completed', delay: 15000 }
    ] : [
        { status: 'Paid', delay: 0 },
        { status: 'preparing', delay: 3000 },
        { status: 'shipped', delay: 6000 },
        { status: 'completed', delay: 12000 }
    ];
    
    progressSteps.forEach(step => {
        setTimeout(() => {
            if (step.status !== currentStatus) {
                currentStatus = step.status;
                
                // Update order in localStorage
                let orders = JSON.parse(localStorage.getItem('orders') || '[]');
                const orderIndex = orders.findIndex(o => o.id === order.id);
                if (orderIndex !== -1) {
                    orders[orderIndex].status = currentStatus;
                    localStorage.setItem('orders', JSON.stringify(orders));
                }
                
                // Update display
                const statusClass = getStatusClass(currentStatus);
                $('#order-info').find('.badge').removeClass('bg-success bg-warning bg-info bg-secondary').addClass(statusClass).text(getStatusDisplay(currentStatus));
                updateTimelineStatus(currentStatus);
                
                // Show completion message
                if (currentStatus === 'completed') {
                    showCompletionOptions(order);
                }
            }
        }, step.delay);
    });
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

function showCompletionOptions(order) {
    // Add completion message and reorder option
    setTimeout(() => {
        const completionHtml = `
            <div class="alert alert-success mt-4">
                <h5 class="alert-heading">
                    <i class="fas fa-check-circle me-2"></i>
                    Order Completed!
                </h5>
                <p>Your order has been delivered successfully. We hope you enjoy your new smart home products!</p>
                <hr>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary" id="reorder-button">
                        <i class="fas fa-redo me-1"></i> Reorder These Items
                    </button>
                    <button class="btn btn-outline-secondary" id="leave-review">
                        <i class="fas fa-star me-1"></i> Leave a Review
                    </button>
                </div>
            </div>
        `;
        
        $('#order-items').append(completionHtml);
        
        // Reorder functionality
        $('#reorder-button').on('click', function() {
            const cartItems = order.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                image_url: item.image_url,
                category: item.category,
                quantity: item.quantity,
                in_stock: true // Assume available for reorder
            }));
            
            localStorage.setItem('cart', JSON.stringify(cartItems));
            alert('Items have been added to your cart!');
            window.location.href = 'index.html';
        });
        
        $('#leave-review').on('click', function() {
            alert('Thank you for your interest! Review functionality would be implemented here.');
        });
        
    }, 1000);
}
