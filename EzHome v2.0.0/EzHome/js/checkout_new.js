$(document).ready(function() {
    let cart = [];
    let cartState = null;
    let checkoutStartTime = null;
    let checkoutTimer = null;
    let currentUser = null;

    // Initialize checkout process
    function initializeCheckout() {
        // Check user authentication first
        currentUser = getCurrentUser();
        if (!currentUser) {
            showAuthenticationRequired();
            return;
        }

        // Check if cart manager is available
        if (!window.cartManager) {
            showError('Cart system not loaded. Please return to the home page.');
            return;
        }

        // Get cart data
        cart = window.cartManager.getCart();
        if (!cart || cart.length === 0) {
            showEmptyCart();
            return;
        }

        // Set cart state and start checkout session
        initializeCheckoutSession();
        
        // Setup all sections
        prefillUserInfo();
        setupDeliveryOptions();
        setupPaymentMethods();
        displayOrderSummary();
        startCheckoutTimer();
        
        // Show main content
        showCheckoutContent();
    }

    function getCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    }

    function showAuthenticationRequired() {
        $('#auth-check').show();
        $('#billing-section, #delivery-section, #payment-section, #action-buttons').hide();
    }

    function showError(message) {
        $('.checkout-section').html(`
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
                <div class="mt-3">
                    <a href="index.html" class="btn btn-primary">Return to Home</a>
                </div>
            </div>
        `);
    }

    function showEmptyCart() {
        $('.checkout-section').html(`
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-4x text-muted mb-4"></i>
                <h3>Your cart is empty</h3>
                <p class="text-muted mb-4">Please add items to your cart before checkout.</p>
                <a href="index.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `);
    }

    function showCheckoutContent() {
        $('#billing-section, #delivery-section, #payment-section, #action-buttons').show();
        $('#auth-check').hide();
    }

    function initializeCheckoutSession() {
        cartState = window.cartManager.STATES.IN_CHECKOUT;
        window.cartManager.setCartState(cartState);
        checkoutStartTime = Date.now();
        localStorage.setItem('checkoutStartTime', checkoutStartTime);
        
        // Reserve stock temporarily
        reserveStock();
    }

    function reserveStock() {
        cart.forEach(item => {
            const product = window.products.find(p => p.id === item.id);
            if (product) {
                product.tempReserved = true;
            }
        });
    }

    function releaseStock() {
        cart.forEach(item => {
            const product = window.products.find(p => p.id === item.id);
            if (product) {
                product.tempReserved = false;
            }
        });
    }

    function prefillUserInfo() {
        if (currentUser) {
            $('#first-name').val(currentUser.firstName || '');
            $('#last-name').val(currentUser.lastName || '');
            $('#email').val(currentUser.email || '');
            $('#phone').val(currentUser.phone || '');
            $('#address').val(currentUser.address || '');
            
            // Extract city, state, zip from address if available
            if (currentUser.city) $('#city').val(currentUser.city);
            if (currentUser.state) $('#state').val(currentUser.state);
            if (currentUser.zip) $('#zip').val(currentUser.zip);
        }
    }

    function setupDeliveryOptions() {
        // Handle delivery option changes
        $('input[name="delivery-option"]').on('change', function() {
            const selectedOption = $(this).val();
            
            if (selectedOption === 'home-delivery') {
                $('#delivery-address').show();
                $('#collection-info').hide();
                updateShippingCalculation(true);
            } else {
                $('#delivery-address').hide();
                $('#collection-info').show();
                updateShippingCalculation(false);
            }
            
            displayOrderSummary();
        });
        
        // Handle same as billing address checkbox
        $('#same-as-billing').on('change', function() {
            if ($(this).is(':checked')) {
                $('#different-delivery-address').hide();
                copyBillingToDelivery();
            } else {
                $('#different-delivery-address').show();
            }
        });
        
        // Initialize with self-collection selected
        updateShippingCalculation(false);
    }

    function updateShippingCalculation(includeShipping) {
        localStorage.setItem('includeShipping', includeShipping.toString());
    }

    function copyBillingToDelivery() {
        $('#delivery-first-name').val($('#first-name').val());
        $('#delivery-last-name').val($('#last-name').val());
        $('#delivery-address-field').val($('#address').val());
        $('#delivery-city').val($('#city').val());
        $('#delivery-state').val($('#state').val());
        $('#delivery-zip').val($('#zip').val());
    }

    function setupPaymentMethods() {
        // Handle payment method changes
        $('input[name="payment-method"]').on('change', function() {
            const selectedMethod = $(this).val();
            const totals = window.cartManager.calculateTotals();
            
            if (selectedMethod === 'credit-card') {
                $('#credit-card-section').show();
                $('#cod-section').hide();
                
                // Make credit card fields required
                $('#card-number, #expiry-month, #expiry-year, #cvv, #cardholder-name').attr('required', true);
                $('#cod-confirmation').removeAttr('required');
                
                // Update button text and security notice
                $('#order-button-text').text('Complete Secure Order');
                $('.security-notice .alert').removeClass('alert-warning').addClass('alert-info')
                    .html('<i class="fas fa-shield-alt me-2"></i><strong>Secure Checkout</strong><br>Your payment information is encrypted and secure.');
            } else if (selectedMethod === 'cash-on-delivery') {
                $('#credit-card-section').hide();
                $('#cod-section').show();
                
                // Remove required attribute from credit card fields
                $('#card-number, #expiry-month, #expiry-year, #cvv, #cardholder-name').removeAttr('required');
                $('#cod-confirmation').attr('required', true);
                
                // Update COD amount and button text
                $('#cod-amount').text(totals.total.toFixed(2));
                $('#order-button-text').text('Confirm Order (Pay on Delivery)');
                $('.security-notice .alert').removeClass('alert-info').addClass('alert-warning')
                    .html('<i class="fas fa-money-bill-wave me-2"></i><strong>Cash on Delivery</strong><br>Please ensure you have the exact amount ready when your order arrives.');
            }
        });
        
        // Initialize with credit card selected
        $('#credit-card').prop('checked', true).trigger('change');
    }

    function displayOrderSummary() {
        const checkoutItems = $('#checkout-items');
        checkoutItems.empty();

        cart.forEach(item => {
            const itemHtml = `
                <div class="checkout-item border-bottom pb-2 mb-2">
                    <div class="row align-items-center">
                        <div class="col-3">
                            <img src="${item.image_url}" alt="${item.name}" class="img-fluid rounded" style="max-height: 60px; object-fit: cover;">
                        </div>
                        <div class="col-6">
                            <h6 class="mb-1">${item.name}</h6>
                            <small class="text-muted">Qty: ${item.quantity}</small>
                        </div>
                        <div class="col-3 text-end">
                            <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
                        </div>
                    </div>
                </div>
            `;
            checkoutItems.append(itemHtml);
        });

        // Display totals
        const totals = window.cartManager.calculateTotals();
        
        const totalsHtml = `
            <div class="order-totals mt-3 pt-3 border-top">
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
                    <span>Total:</span>
                    <span class="text-success">$${totals.total.toFixed(2)}</span>
                </div>
            </div>
        `;
        
        $('#order-totals').html(totalsHtml);
    }

    function startCheckoutTimer() {
        const timeLimit = 15 * 60 * 1000; // 15 minutes
        const startTime = parseInt(checkoutStartTime);
        
        checkoutTimer = setInterval(function() {
            const elapsed = Date.now() - startTime;
            const remaining = timeLimit - elapsed;
            
            if (remaining <= 0) {
                handleCheckoutTimeout();
                return;
            }
            
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            $('#timer-display').text(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            
            // Warning at 2 minutes
            if (remaining <= 2 * 60 * 1000) {
                $('#checkout-timer').removeClass('bg-warning').addClass('bg-danger text-white');
            }
        }, 1000);
    }

    function handleCheckoutTimeout() {
        clearInterval(checkoutTimer);
        releaseStock();
        window.cartManager.setCartState(window.cartManager.STATES.OPEN);
        localStorage.removeItem('checkoutStartTime');
        
        alert('Your checkout session has expired. Please try again.');
        window.location.href = 'index.html';
    }

    // Card number formatting
    $('#card-number').on('input', function() {
        let value = $(this).val().replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        if (formattedValue !== $(this).val()) {
            $(this).val(formattedValue);
        }
    });

    // CVV input restriction
    $('#cvv').on('input', function() {
        $(this).val($(this).val().replace(/[^0-9]/g, ''));
    });

    // Form validation
    function validateForms() {
        const billingForm = $('#billing-form')[0];
        const selectedPaymentMethod = $('input[name="payment-method"]:checked').val();
        
        if (!billingForm.checkValidity()) {
            billingForm.reportValidity();
            return false;
        }
        
        // Validate payment method specific fields
        if (selectedPaymentMethod === 'credit-card') {
            const paymentForm = $('#payment-form')[0];
            if (!paymentForm.checkValidity()) {
                paymentForm.reportValidity();
                return false;
            }
        } else if (selectedPaymentMethod === 'cash-on-delivery') {
            if (!$('#cod-confirmation').is(':checked')) {
                alert('Please confirm that you will pay the amount in cash upon delivery.');
                $('#cod-confirmation').focus();
                return false;
            }
        }

        // Validate delivery address if home delivery is selected and different address is chosen
        const isHomeDelivery = $('input[name="delivery-option"]:checked').val() === 'home-delivery';
        const isDifferentAddress = !$('#same-as-billing').is(':checked');
        
        if (isHomeDelivery && isDifferentAddress) {
            const requiredFields = ['#delivery-first-name', '#delivery-last-name', '#delivery-address-field', '#delivery-city', '#delivery-state', '#delivery-zip'];
            
            for (let field of requiredFields) {
                const $field = $(field);
                if (!$field.val().trim()) {
                    $field.focus();
                    alert('Please fill in all required delivery address fields.');
                    return false;
                }
            }
        }

        return true;
    }

    // Back to cart button
    $('#back-to-cart').on('click', function() {
        if (confirm('Are you sure you want to return to your cart? Your checkout session will be cancelled.')) {
            releaseStock();
            window.cartManager.setCartState(window.cartManager.STATES.OPEN);
            localStorage.removeItem('checkoutStartTime');
            clearInterval(checkoutTimer);
            window.location.href = 'index.html';
        }
    });

    // Complete order button
    $('#complete-order').on('click', function() {
        if (!validateForms()) {
            return;
        }

        const selectedPaymentMethod = $('input[name="payment-method"]:checked').val();
        
        if (selectedPaymentMethod === 'credit-card') {
            const cardNumber = $('#card-number').val().replace(/\s/g, '');
            
            // Check for test rejection (cards starting with 9999)
            if (cardNumber.startsWith('9999')) {
                alert('Payment failed: Invalid card number. Please use a different payment method.');
                return;
            }
        }

        // Disable button and show loading state
        const btn = $(this);
        btn.prop('disabled', true);
        
        if (selectedPaymentMethod === 'credit-card') {
            btn.html('<i class="fas fa-spinner fa-spin me-1"></i> Processing Payment...');
            setTimeout(() => processPayment(selectedPaymentMethod), 2000);
        } else {
            btn.html('<i class="fas fa-spinner fa-spin me-1"></i> Confirming Order...');
            setTimeout(() => processPayment(selectedPaymentMethod), 1000);
        }
    });

    function processPayment(paymentMethod) {
        try {
            // Create order object with proper structure
            const deliveryOption = $('input[name="delivery-option"]:checked').val();
            const sameAsBilling = $('#same-as-billing').is(':checked');
            const totals = window.cartManager.calculateTotals();
            
            const order = {
                id: 'ORD-' + Date.now(),
                user: currentUser.username,
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image_url: item.image_url,
                    category: item.category
                })),
                totals: totals,
                billingInfo: {
                    firstName: $('#first-name').val(),
                    lastName: $('#last-name').val(),
                    email: $('#email').val(),
                    phone: $('#phone').val(),
                    address: $('#address').val(),
                    city: $('#city').val(),
                    state: $('#state').val(),
                    zip: $('#zip').val()
                },
                deliveryInfo: {
                    option: deliveryOption,
                    address: deliveryOption === 'home-delivery' ? {
                        firstName: sameAsBilling ? $('#first-name').val() : $('#delivery-first-name').val(),
                        lastName: sameAsBilling ? $('#last-name').val() : $('#delivery-last-name').val(),
                        address: sameAsBilling ? $('#address').val() : $('#delivery-address-field').val(),
                        city: sameAsBilling ? $('#city').val() : $('#delivery-city').val(),
                        state: sameAsBilling ? $('#state').val() : $('#delivery-state').val(),
                        zip: sameAsBilling ? $('#zip').val() : $('#delivery-zip').val(),
                        instructions: $('#delivery-instructions').val()
                    } : null
                },
                paymentMethod: paymentMethod,
                paymentInfo: paymentMethod === 'credit-card' ? {
                    method: 'Credit Card',
                    cardNumber: '****' + $('#card-number').val().slice(-4),
                    cardholderName: $('#cardholder-name').val()
                } : {
                    method: 'Cash on Delivery',
                    amount: totals.total,
                    note: 'Payment to be collected upon delivery'
                },
                orderDate: new Date().toISOString(),
                status: paymentMethod === 'credit-card' ? 'Paid' : 'Confirmed - Awaiting Payment',
                createdBy: currentUser.username,
                lastUpdated: new Date().toISOString()
            };

            // Mark stock as sold
            cart.forEach(item => {
                const product = window.products.find(p => p.id === item.id);
                if (product) {
                    product.tempReserved = false;
                    product.soldInDemo = true;
                }
            });

            // Save order to localStorage
            let orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));

            // Update cart state
            window.cartManager.setCartState(paymentMethod === 'credit-card' ? window.cartManager.STATES.PAID : window.cartManager.STATES.OPEN);
            
            // Clear cart and checkout session
            window.cartManager.clearCart();
            localStorage.removeItem('checkoutStartTime');
            clearInterval(checkoutTimer);

            // Show success message
            showOrderSuccess(order);

        } catch (error) {
            console.error('Order processing error:', error);
            alert('Order processing failed. Please try again.');
            $('#complete-order').prop('disabled', false).html('<i class="fas fa-lock me-1"></i> <span id="order-button-text">Complete Secure Order</span>');
        }
    }

    function showOrderSuccess(order) {
        $('.checkout-section').html(`
            <div class="text-center py-5">
                <i class="fas fa-check-circle fa-4x text-success mb-4"></i>
                <h2 class="text-success">Order Confirmed!</h2>
                <p class="lead">Thank you for your order. Your order number is:</p>
                <h4 class="text-primary">${order.id}</h4>
                <div class="mt-4">
                    <p class="text-muted">
                        ${order.paymentMethod === 'credit-card' ? 
                            'Your payment has been processed successfully.' : 
                            'Please have the exact amount ready when your order arrives.'}
                    </p>
                </div>
                <div class="mt-4">
                    <a href="order-status.html?order=${order.id}" class="btn btn-primary me-2">
                        <i class="fas fa-eye me-1"></i>Track Order
                    </a>
                    <a href="index.html" class="btn btn-outline-secondary">
                        <i class="fas fa-home me-1"></i>Continue Shopping
                    </a>
                </div>
            </div>
        `);
        
        // Hide order summary and timer
        $('.order-summary-section').html(`
            <div class="card">
                <div class="card-body text-center">
                    <i class="fas fa-check-circle fa-3x text-success mb-3"></i>
                    <h5>Order Placed Successfully!</h5>
                    <p class="text-muted">Total: $${order.totals.total.toFixed(2)}</p>
                </div>
            </div>
        `);
        $('#checkout-timer').hide();
    }

    // Handle page unload
    $(window).on('beforeunload', function() {
        if (cartState === window.cartManager.STATES.IN_CHECKOUT) {
            return 'Are you sure you want to leave? Your checkout session will be lost.';
        }
    });

    // Initialize checkout when page loads
    initializeCheckout();
});
