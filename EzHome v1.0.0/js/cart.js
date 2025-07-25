$(document).ready(function() {
    // Cart state management
    const CART_STATES = {
        OPEN: 'open',
        MOVING_TO_CHECKOUT: 'moving_to_checkout',
        IN_CHECKOUT: 'in_checkout',
        PAID: 'paid',
        SHIPPED: 'shipped',
        COMPLETED: 'completed'
    };

    let cart = [];
    let cartState = CART_STATES.OPEN;

    // Initialize cart based on logged-in user
    function initializeCart() {
        loadUserCart();
        updateCartCount();
        updateCartModal();
        checkCartState();
    }

    // Load cart for current user
    function loadUserCart() {
        const currentUser = getCurrentUser();
        if (currentUser) {
            // Load user-specific cart
            const userCartKey = `cart_${currentUser.username}`;
            const userCartStateKey = `cartState_${currentUser.username}`;
            
            cart = JSON.parse(localStorage.getItem(userCartKey)) || [];
            cartState = localStorage.getItem(userCartStateKey) || CART_STATES.OPEN;
        } else {
            // Guest cart (temporary)
            cart = JSON.parse(localStorage.getItem('guest_cart')) || [];
            cartState = localStorage.getItem('guest_cartState') || CART_STATES.OPEN;
        }
    }

    // Save cart for current user
    function saveUserCart() {
        const currentUser = getCurrentUser();
        if (currentUser) {
            // Save user-specific cart
            const userCartKey = `cart_${currentUser.username}`;
            const userCartStateKey = `cartState_${currentUser.username}`;
            
            localStorage.setItem(userCartKey, JSON.stringify(cart));
            localStorage.setItem(userCartStateKey, cartState);
        } else {
            // Save guest cart
            localStorage.setItem('guest_cart', JSON.stringify(cart));
            localStorage.setItem('guest_cartState', cartState);
        }
    }

    // Transfer guest cart to user cart on login
    function transferGuestCartToUser() {
        const guestCart = JSON.parse(localStorage.getItem('guest_cart')) || [];
        const currentUser = getCurrentUser();
        
        if (currentUser && guestCart.length > 0) {
            const userCartKey = `cart_${currentUser.username}`;
            const existingUserCart = JSON.parse(localStorage.getItem(userCartKey)) || [];
            
            // Merge guest cart with existing user cart
            let itemsAdded = 0;
            guestCart.forEach(guestItem => {
                const existingItem = existingUserCart.find(item => item.id === guestItem.id);
                if (existingItem) {
                    existingItem.quantity += guestItem.quantity;
                } else {
                    existingUserCart.push(guestItem);
                    itemsAdded++;
                }
            });
            
            // Save merged cart and clear guest cart
            cart = existingUserCart;
            localStorage.setItem(userCartKey, JSON.stringify(cart));
            localStorage.removeItem('guest_cart');
            localStorage.removeItem('guest_cartState');
            
            updateCartCount();
            updateCartModal();
            
            // Show notification about cart merge
            if (itemsAdded > 0 || guestCart.length > 0) {
                showCartTransferNotification(guestCart.length);
            }
        }
    }
    
    function showCartTransferNotification(itemCount) {
        const notification = $(`
            <div class="alert alert-success alert-dismissible fade show position-fixed" 
                 style="top: 80px; right: 20px; z-index: 9999; min-width: 300px;">
                <i class="fas fa-shopping-cart me-2"></i>
                Your guest cart (${itemCount} items) has been transferred to your account!
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `);
        
        $('body').append(notification);
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            notification.alert('close');
        }, 5000);
    }

    // Listen for user login/logout events
    $(document).on('userLoggedIn', function() {
        transferGuestCartToUser();
        loadUserCart();
        updateCartCount();
        updateCartModal();
    });

    $(document).on('userLoggedOut', function() {
        // Clear current cart and reload guest cart
        cart = [];
        cartState = CART_STATES.OPEN;
        loadUserCart();
        updateCartCount();
        updateCartModal();
    });

    function checkCartState() {
        // If cart is in checkout state but we're not on checkout page, reset to open
        if (cartState === CART_STATES.IN_CHECKOUT && !window.location.pathname.includes('checkout.html')) {
            cartState = CART_STATES.OPEN;
            saveUserCart();
        }
    }

    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        $('#cart-count').text(totalItems);
    }

    function calculateCartTotals() {
        let subtotal = 0;
        let tax = 0;
        let shipping = 0;
        let total = 0;

        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        // Calculate tax (8% for example)
        tax = subtotal * 0.08;

        // Calculate shipping based on delivery option
        const includeShipping = localStorage.getItem('includeShipping');
        const isDelivery = includeShipping === 'true';
        
        if (isDelivery) {
            // Home delivery: $15 shipping charge
            shipping = 15.00;
        } else {
            // Self collection: no shipping charges
            shipping = 0;
        }

        total = subtotal + tax + shipping;

        return {
            subtotal: subtotal,
            tax: tax,
            shipping: shipping,
            total: total,
            deliveryMethod: isDelivery ? 'home-delivery' : 'self-collection'
        };
    }

    function updateCartModal() {
        const cartItems = $('#cart-items');
        const cartFooter = $('.modal-footer');
        cartItems.empty();

        if (cart.length === 0) {
            cartItems.html(`
                <div class="text-center py-4">
                    <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <h5>Your cart is empty</h5>
                    <p class="text-muted">Add some amazing smart home products to get started!</p>
                </div>
            `);
            cartFooter.html('<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>');
            return;
        }

        // Display cart items
        cart.forEach((item, index) => {
            const cartItem = `
                <div class="cart-item border-bottom pb-3 mb-3">
                    <div class="row align-items-center">
                        <div class="col-3">
                            <img src="${item.image_url}" alt="${item.name}" class="img-fluid rounded" style="max-height: 80px; object-fit: cover;">
                        </div>
                        <div class="col-6">
                            <h6 class="mb-1">${item.name}</h6>
                            <small class="text-muted">${item.category}</small>
                            <div class="d-flex align-items-center mt-2">
                                <button class="btn btn-sm btn-outline-secondary decrease-quantity" data-index="${index}" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                                <span class="mx-2 fw-bold">${item.quantity}</span>
                                <button class="btn btn-sm btn-outline-secondary increase-quantity" data-index="${index}">+</button>
                            </div>
                        </div>
                        <div class="col-3 text-end">
                            <div class="fw-bold text-success">$${(item.price * item.quantity).toFixed(2)}</div>
                            <button class="btn btn-sm btn-outline-danger mt-1 remove-from-cart" data-index="${index}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            cartItems.append(cartItem);
        });

        // Calculate and display totals
        const totals = calculateCartTotals();
        
        let shippingText = '';
        let shippingNote = '';
        
        if (totals.deliveryMethod === 'collection') {
            shippingText = 'Self Collection';
            shippingNote = '<small class="text-success">🏪 Free pickup from our store!</small>';
        } else {
            shippingText = totals.shipping === 0 ? 'FREE' : '$' + totals.shipping.toFixed(2);
            shippingNote = totals.shipping === 0 ? 
                '<small class="text-success">🎉 Free shipping on orders over $299!</small>' : 
                '<small class="text-muted">Free shipping on orders over $299</small>';
        }
        
        const totalsDisplay = `
            <div class="cart-totals mt-3 p-3 bg-light rounded">
                <div class="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>$${totals.subtotal.toFixed(2)}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span>Tax (8%):</span>
                    <span>$${totals.tax.toFixed(2)}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span>${totals.deliveryMethod === 'collection' ? 'Collection:' : 'Shipping:'}:</span>
                    <span>${shippingText}</span>
                </div>
                ${shippingNote}
                <hr>
                <div class="d-flex justify-content-between fw-bold fs-5">
                    <span>Total:</span>
                    <span class="text-success">$${totals.total.toFixed(2)}</span>
                </div>
            </div>
        `;
        
        cartItems.append(totalsDisplay);

        // Update footer with checkout button
        const isCartEditable = cartState === CART_STATES.OPEN;
        cartFooter.html(`
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Continue Shopping</button>
            <button type="button" class="btn btn-primary" id="checkout-button" ${!isCartEditable ? 'disabled' : ''}>
                Proceed to Checkout
            </button>
        `);
    }

    // Add to cart
    $(document).on('click', '.add-to-cart', function() {
        if (cartState !== CART_STATES.OPEN) {
            alert('Cart is currently locked. Please complete your current order or wait for timeout.');
            return;
        }

        // Handle both data-id and data-product-id attributes
        const productId = parseInt($(this).data('id') || $(this).data('product-id'));
        
        // Load current products from localStorage if available
        const storedProducts = localStorage.getItem('products');
        let products = window.products;
        if (storedProducts) {
            try {
                products = JSON.parse(storedProducts);
            } catch (error) {
                console.error('Error parsing stored products:', error);
            }
        }
        
        const product = products.find(p => p.id === productId);

        if (!product) {
            alert('Product not found!');
            return;
        }

        // Check stock availability
        if (product.stock !== undefined) {
            if (product.stock === 0) {
                alert('Sorry, this product is currently out of stock.');
                return;
            }
            
            // Check if adding one more would exceed stock
            const cartItem = cart.find(item => item.id === productId);
            const currentCartQuantity = cartItem ? cartItem.quantity : 0;
            
            if (currentCartQuantity >= product.stock) {
                alert(`Sorry, only ${product.stock} units are available in stock.`);
                return;
            }
        } else if (product.in_stock === false) {
            alert('Sorry, this product is currently out of stock.');
            return;
        }

        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ 
                id: product.id,
                name: product.name,
                price: product.price_sgd || product.price,
                image_url: product.image || product.image_url,
                category: product.category,
                quantity: 1,
                in_stock: product.in_stock !== false,
                stock: product.stock
            });
        }

        saveUserCart();
        updateCartCount();
        updateCartModal();
        
        // Show success feedback
        const btn = $(this);
        const originalText = btn.text();
        btn.text('Added!').addClass('btn-success').removeClass('btn-success');
        setTimeout(() => {
            btn.text(originalText);
        }, 1000);
    });

    // Increase quantity
    $(document).on('click', '.increase-quantity', function() {
        if (cartState !== CART_STATES.OPEN) return;
        
        const index = parseInt($(this).data('index'));
        const cartItem = cart[index];
        
        // Check stock limit if available
        if (cartItem.stock !== undefined) {
            if (cartItem.quantity >= cartItem.stock) {
                alert(`Sorry, only ${cartItem.stock} units are available in stock.`);
                return;
            }
        }
        
        cart[index].quantity++;
        saveUserCart();
        updateCartCount();
        updateCartModal();
    });

    // Decrease quantity
    $(document).on('click', '.decrease-quantity', function() {
        if (cartState !== CART_STATES.OPEN) return;
        
        const index = parseInt($(this).data('index'));
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
        saveUserCart();
        updateCartCount();
        updateCartModal();
    });

    // Remove from cart
    $(document).on('click', '.remove-from-cart', function() {
        if (cartState !== CART_STATES.OPEN) return;
        
        const index = parseInt($(this).data('index'));
        const itemName = cart[index].name;
        
        if (confirm(`Remove ${itemName} from cart?`)) {
            cart.splice(index, 1);
            saveUserCart();
            updateCartCount();
            updateCartModal();
        }
    });

    // Checkout button
    $(document).on('click', '#checkout-button', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            alert('You must be logged in to check out.');
            $('#loginModal').modal('show');
            return;
        }

        // Change cart state to moving_to_checkout
        cartState = CART_STATES.MOVING_TO_CHECKOUT;
        saveUserCart();

        // Check stock availability for all items
        const outOfStockItems = [];
        const availableItems = [];

        cart.forEach(item => {
            const product = window.products.find(p => p.id === item.id);
            if (!product || !product.in_stock) {
                outOfStockItems.push(item);
            } else {
                availableItems.push(item);
            }
        });

        if (outOfStockItems.length > 0) {
            const outOfStockNames = outOfStockItems.map(item => item.name).join(', ');
            const message = `The following items are no longer available: ${outOfStockNames}\n\nWould you like to proceed with the remaining items?`;
            
            if (confirm(message)) {
                // Update cart with only available items
                cart = availableItems;
                saveUserCart();
                
                if (cart.length === 0) {
                    alert('No items available for checkout.');
                    cartState = CART_STATES.OPEN;
                    saveUserCart();
                    return;
                }
            } else {
                // Reset cart state
                cartState = CART_STATES.OPEN;
                saveUserCart();
                return;
            }
        }

        // Proceed to checkout
        $('#cartModal').modal('hide');
        window.location.href = 'checkout.html';
    });

    // Expose cart functions globally for other scripts
    window.cartManager = {
        getCart: () => cart,
        getCartState: () => cartState,
        setCartState: (state) => {
            cartState = state;
            saveUserCart();
        },
        calculateTotals: calculateCartTotals,
        updateCartDisplay: () => {
            updateCartCount();
            updateCartModal();
        },
        clearCart: () => {
            cart = [];
            cartState = CART_STATES.OPEN;
            saveUserCart();
            updateCartCount();
            updateCartModal();
        },
        STATES: CART_STATES,
        // Debug function to show current cart info
        debugInfo: () => {
            const currentUser = getCurrentUser();
            console.log('Current User:', currentUser ? currentUser.username : 'Guest');
            console.log('Cart Contents:', cart);
            console.log('Cart State:', cartState);
            console.log('Cart Key:', currentUser ? `cart_${currentUser.username}` : 'guest_cart');
        }
    };

    // Initialize cart
    initializeCart();
});