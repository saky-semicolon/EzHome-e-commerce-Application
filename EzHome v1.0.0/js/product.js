$(document).ready(function() {
    // Initialize cart manager if not already available
    if (!window.cartManager) {
        console.log('Cart manager not found, initializing...');
        // Wait a bit for other scripts to load
        setTimeout(() => {
            if (!window.cartManager) {
                console.error('Cart manager still not available');
                alert('Cart system not loaded. Please reload the page.');
            }
        }, 1000);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = window.products.find(p => p.id === productId);
    const currentUser = getCurrentUser();

    if (product) {
        // Get real-time rating data - only show if there are actual customer ratings
        const ratingData = window.ratingManager ? window.ratingManager.getProductRating(productId) : null;
        const hasRealRatings = ratingData && ratingData.totalRatings > 0;
        
        let productDetails = `
            <div class="row">
                <div class="col-lg-6">
                    <div class="product-image">
                        <img src="${product.image_url}" class="img-fluid rounded shadow" alt="${product.name}" 
                             style="width: 100%; max-height: 500px; object-fit: cover;">
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="product-info">
                        <div class="product-header mb-4">
                            <h1 class="mb-2">${product.name}</h1>
                            <div class="product-badges mb-3">
                                <span class="badge bg-primary me-1">${product.category}</span>
                                <span class="badge bg-secondary me-1">${product.family}</span>
                                ${product.IsActive ? '<span class="badge bg-success">Available</span>' : '<span class="badge bg-danger">Out of Stock</span>'}
                            </div>
                            ${hasRealRatings ? `
                                <div class="product-rating mb-3" id="product-rating-display">
                                    <div class="d-flex align-items-center">
                                        <div class="stars me-2">
                                            ${window.ratingManager.generateStarDisplay(ratingData.averageRating)}
                                        </div>
                                        <span class="rating-text me-2">
                                            <strong>${ratingData.averageRating.toFixed(1)}</strong>
                                        </span>
                                        <span class="text-muted">
                                            (${ratingData.totalRatings} ${ratingData.totalRatings === 1 ? 'review' : 'reviews'})
                                        </span>
                                        <a href="#reviews-section" class="text-decoration-none ms-2">
                                            <i class="fas fa-comments text-primary"></i> See reviews
                                        </a>
                                    </div>
                                </div>
                            ` : ''}
                        </div>

                        <div class="product-description mb-4">
                            <h5 class="mb-3"><i class="fas fa-info-circle text-primary me-2"></i>Product Description</h5>
                            <p class="text-muted mb-3">${product.description}</p>
                            <div class="key-features">
                                <h6 class="mb-2">Key Features:</h6>
                                <ul class="list-unstyled">
                                    ${product.features ? product.features.map(feature => `<li><i class="fas fa-check text-success me-2"></i>${feature}</li>`).join('') : `
                                        <li><i class="fas fa-check text-success me-2"></i>Smart home integration</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Energy efficient design</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Premium build quality</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Easy installation</li>
                                    `}
                                </ul>
                            </div>
                        </div>

                        <div class="available-colors mb-4">
                            <h6 class="mb-2"><i class="fas fa-palette text-primary me-2"></i>Available Colors:</h6>
                            <div class="color-options d-flex flex-wrap gap-2">
                                ${product.colors.map(color => `
                                    <div class="color-option">
                                        <input type="radio" name="color" id="color-${color}" value="${color}" class="d-none">
                                        <label for="color-${color}" class="badge bg-light text-dark border px-3 py-2 cursor-pointer color-label">
                                            ${color}
                                        </label>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="pricing-section mb-4">
                            <div class="price-display">
                                <h2 class="text-success mb-2">$${product.price.toFixed(2)}</h2>
                                <div class="price-info">
                                    <small class="text-muted">
                                        <i class="fas fa-truck me-1"></i>Free shipping on orders over $299
                                    </small>
                                    <br>
                                    <small class="text-muted">
                                        <i class="fas fa-shield-alt me-1"></i>2-year warranty included
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div class="purchase-section">
                            <div class="quantity-selector mb-3">
                                <label class="form-label">Quantity:</label>
                                <div class="input-group" style="width: 120px;">
                                    <button class="btn btn-outline-secondary qty-minus" type="button">-</button>
                                    <input type="number" class="form-control text-center" value="1" min="1" max="10" id="quantity-input">
                                    <button class="btn btn-outline-secondary qty-plus" type="button">+</button>
                                </div>
                            </div>
                            
                            <div class="action-buttons d-grid gap-2">
                                <button class="btn btn-success btn-lg add-to-cart" data-id="${product.id}">
                                    <i class="fas fa-cart-plus me-2"></i>Add to Cart
                                </button>
                                <button class="btn btn-outline-primary">
                                    <i class="fas fa-heart me-2"></i>Add to Wishlist
                                </button>
                                <a href="index.html" class="btn btn-outline-secondary">
                                    <i class="fas fa-arrow-left me-2"></i>Back to Products
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Detailed Specifications Tab -->
            <div class="row mt-5">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <ul class="nav nav-tabs card-header-tabs" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" data-bs-toggle="tab" href="#specifications" role="tab">
                                        <i class="fas fa-cog me-2"></i>Specifications
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-bs-toggle="tab" href="#compatibility" role="tab">
                                        <i class="fas fa-puzzle-piece me-2"></i>Compatibility
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-bs-toggle="tab" href="#support" role="tab">
                                        <i class="fas fa-life-ring me-2"></i>Support
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div class="card-body">
                            <div class="tab-content">
                                <div class="tab-pane active" id="specifications" role="tabpanel">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <h6 class="mb-3">Technical Specifications</h6>
                                            <table class="table table-borderless">
                                                <tr><td><strong>Model Number:</strong></td><td>${product.model_number}</td></tr>
                                                <tr><td><strong>Dimensions:</strong></td><td>${product.dimensions}</td></tr>
                                                <tr><td><strong>Weight:</strong></td><td>${product.weight}</td></tr>
                                                <tr><td><strong>Power Consumption:</strong></td><td>${product.power}</td></tr>
                                                <tr><td><strong>Material:</strong></td><td>${product.material || 'Premium composite'}</td></tr>
                                                <tr><td><strong>Warranty:</strong></td><td>${product.warranty || '2 years manufacturer'}</td></tr>
                                            </table>
                                        </div>
                                        <div class="col-md-6">
                                            <h6 class="mb-3">Smart Features</h6>
                                            <ul class="list-unstyled">
                                                <li><i class="fas fa-wifi text-primary me-2"></i>Wi-Fi connectivity</li>
                                                <li><i class="fas fa-mobile-alt text-primary me-2"></i>Mobile app control</li>
                                                <li><i class="fas fa-microphone text-primary me-2"></i>Voice assistant compatible</li>
                                                <li><i class="fas fa-clock text-primary me-2"></i>Scheduling & automation</li>
                                                <li><i class="fas fa-chart-line text-primary me-2"></i>Energy monitoring</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane" id="compatibility" role="tabpanel">
                                    <h6 class="mb-3">Smart Home Compatibility</h6>
                                    <div class="row g-3">
                                        <div class="col-md-3 text-center">
                                            <div class="compatibility-item p-3 border rounded">
                                                <i class="fab fa-amazon fa-2x text-warning mb-2"></i>
                                                <br><strong>Alexa</strong>
                                            </div>
                                        </div>
                                        <div class="col-md-3 text-center">
                                            <div class="compatibility-item p-3 border rounded">
                                                <i class="fab fa-google fa-2x text-primary mb-2"></i>
                                                <br><strong>Google Home</strong>
                                            </div>
                                        </div>
                                        <div class="col-md-3 text-center">
                                            <div class="compatibility-item p-3 border rounded">
                                                <i class="fab fa-apple fa-2x text-dark mb-2"></i>
                                                <br><strong>HomeKit</strong>
                                            </div>
                                        </div>
                                        <div class="col-md-3 text-center">
                                            <div class="compatibility-item p-3 border rounded">
                                                <i class="fas fa-home fa-2x text-success mb-2"></i>
                                                <br><strong>SmartThings</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane" id="support" role="tabpanel">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <h6 class="mb-3">Installation & Setup</h6>
                                            <ul class="list-unstyled">
                                                <li><i class="fas fa-tools text-primary me-2"></i>Professional installation available</li>
                                                <li><i class="fas fa-book text-primary me-2"></i>Detailed setup guide included</li>
                                                <li><i class="fas fa-video text-primary me-2"></i>Video tutorials available</li>
                                                <li><i class="fas fa-phone text-primary me-2"></i>24/7 technical support</li>
                                            </ul>
                                        </div>
                                        <div class="col-md-6">
                                            <h6 class="mb-3">Customer Support</h6>
                                            <div class="support-contact">
                                                <p><strong>Phone:</strong> 1-800-EZHOME-1</p>
                                                <p><strong>Email:</strong> support@ezhome.com</p>
                                                <p><strong>Live Chat:</strong> Available 24/7</p>
                                                <button class="btn btn-outline-primary btn-sm">
                                                    <i class="fas fa-comments me-1"></i>Start Live Chat
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $('#product-details').html(productDetails);

        // Add customer reviews section only if there are real ratings
        const reviewsSection = generateReviewsSection(productId);
        if (reviewsSection) {
            $('#product-details').append(reviewsSection);
        }

        // Initialize interactive elements
        initializeProductInteractions();

        if (currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Staff')) {
            const adminActions = `
                <div class="admin-actions mt-3">
                    <button class="btn btn-warning edit-product">Edit</button>
                    <button class="btn btn-danger deactivate-product">${product.IsActive ? 'Deactivate' : 'Activate'}</button>
                </div>
            `;
            $('.pricing-action').append(adminActions);

            $('.edit-product').on('click', function() {
                // For simplicity, we'll use prompts. In a real app, you'd use a form.
                const newName = prompt("Enter new name:", product.name);
                const newPrice = prompt("Enter new price:", product.price);
                if (newName && newPrice) {
                    product.name = newName;
                    product.price = parseFloat(newPrice);
                    // Re-render the product details
                    // This is a simplified approach. A more robust solution would re-render the entire component.
                    $('h2').text(product.name);
                    $('h3').text(`$${product.price.toFixed(2)}`);
                }
            });

            $('.deactivate-product').on('click', function() {
                product.IsActive = !product.IsActive;
                $(this).text(product.IsActive ? 'Deactivate' : 'Activate');
            });
        }

    } else {
        $('#product-details').html('<p>Product not found.</p>');
    }
});

function initializeProductInteractions() {
    // Quantity selector functionality
    $('.qty-minus').on('click', function() {
        const input = $('#quantity-input');
        const currentVal = parseInt(input.val());
        if (currentVal > 1) {
            input.val(currentVal - 1);
        }
    });

    $('.qty-plus').on('click', function() {
        const input = $('#quantity-input');
        const currentVal = parseInt(input.val());
        const maxVal = parseInt(input.attr('max'));
        if (currentVal < maxVal) {
            input.val(currentVal + 1);
        }
    });

    // Color selection functionality
    $('.color-label').on('click', function() {
        $('.color-label').removeClass('bg-primary text-white').addClass('bg-light text-dark');
        $(this).removeClass('bg-light text-dark').addClass('bg-primary text-white');
    });

    // Enhanced add to cart with quantity
    $('.add-to-cart').off('click').on('click', function() {
        const productId = $(this).data('id');
        const quantity = parseInt($('#quantity-input').val()) || 1;
        const selectedColor = $('input[name="color"]:checked').val() || $('.color-label.bg-primary').text().trim();
        
        console.log('Add to cart clicked:', { productId, quantity, selectedColor });
        console.log('Cart Manager available:', !!window.cartManager);
        
        if (window.cartManager) {
            // Add items to cart
            for (let i = 0; i < quantity; i++) {
                window.cartManager.addToCart(productId);
            }
            
            // Update cart count in navigation
            const cart = window.cartManager.getCart();
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            $('#cart-count').text(totalItems);
            
            // Show success message with details
            const product = window.products.find(p => p.id === productId);
            if (product) {
                showSuccessMessage(`Added ${quantity} ${product.name}${selectedColor ? ` (${selectedColor})` : ''} to cart!`);
            } else {
                showSuccessMessage(`Added ${quantity} item(s) to cart!`);
            }
        } else {
            console.error('Cart manager not available');
            alert('Cart system not available. Please reload the page and try again.');
        }
    });

    // Wishlist functionality (placeholder)
    $('.btn-outline-primary').on('click', function() {
        if ($(this).find('.fa-heart').length > 0) {
            showSuccessMessage('Added to wishlist!');
            $(this).html('<i class="fas fa-heart text-danger me-2"></i>Added to Wishlist');
            $(this).removeClass('btn-outline-primary').addClass('btn-outline-danger');
        }
    });

    // Live chat functionality (placeholder)
    $('button:contains("Start Live Chat")').on('click', function() {
        alert('Live chat would open here in a real application. You can contact us at support@ezhome.com');
    });
}

function showSuccessMessage(message) {
    // Create and show a toast-like notification
    const toast = $(`
        <div class="alert alert-success alert-dismissible fade show position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
            <i class="fas fa-check-circle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    
    $('body').append(toast);
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        toast.alert('close');
    }, 3000);
}

// Generate customer reviews section
function generateReviewsSection(productId) {
    const ratingData = window.ratingManager ? window.ratingManager.getProductRatingsWithDetails(productId) : null;
    
    // Only show reviews section if there are actual customer ratings
    if (!ratingData || ratingData.totalRatings === 0) {
        return null; // Don't show anything if no customer ratings
    }
    
    // Generate rating distribution
    const distribution = ratingData.distribution;
    const totalRatings = ratingData.totalRatings;
    
    let distributionHtml = '';
    for (let i = 5; i >= 1; i--) {
        const count = distribution[i] || 0;
        const percentage = totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0;
        distributionHtml += `
            <div class="d-flex align-items-center mb-2">
                <span class="me-2" style="min-width: 60px;">${i} stars</span>
                <div class="progress flex-grow-1 me-2" style="height: 8px;">
                    <div class="progress-bar bg-warning" style="width: ${percentage}%"></div>
                </div>
                <span class="text-muted" style="min-width: 40px;">${count}</span>
            </div>
        `;
    }
    
    // Generate individual reviews
    let reviewsHtml = '';
    if (ratingData.ratings && ratingData.ratings.length > 0) {
        const sortedReviews = ratingData.ratings
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10); // Show latest 10 reviews
        
        reviewsHtml = sortedReviews.map(review => {
            const reviewDate = new Date(review.date).toLocaleDateString();
            const isVerified = review.verified;
            
            return `
                <div class="review-item border-bottom py-3">
                    <div class="d-flex align-items-start">
                        <div class="review-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                             style="width: 40px; height: 40px; font-size: 14px;">
                            ${review.userInitials}
                        </div>
                        <div class="flex-grow-1">
                            <div class="d-flex align-items-center mb-2">
                                <strong class="me-2">${review.userName}</strong>
                                ${isVerified ? '<span class="badge bg-success badge-sm me-2">Verified Purchase</span>' : ''}
                                <small class="text-muted">${reviewDate}</small>
                            </div>
                            <div class="rating mb-2">
                                ${window.ratingManager.generateStarDisplay(review.rating)}
                            </div>
                            ${review.review ? `
                                <p class="mb-0 text-muted">${review.review}</p>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    return `
        <div class="row mt-5" id="reviews-section">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">
                            <i class="fas fa-comments text-primary me-2"></i>Customer Reviews
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="text-center mb-4">
                                    <h2 class="mb-1">${ratingData.averageRating.toFixed(1)}</h2>
                                    <div class="mb-2">
                                        ${window.ratingManager.generateStarDisplay(ratingData.averageRating, 'lg')}
                                    </div>
                                    <p class="text-muted mb-0">${totalRatings} ${totalRatings === 1 ? 'review' : 'reviews'}</p>
                                </div>
                                
                                <div class="rating-distribution">
                                    <h6 class="mb-3">Rating Distribution</h6>
                                    ${distributionHtml}
                                </div>
                            </div>
                            <div class="col-md-8">
                                <div class="reviews-list">
                                    <div class="d-flex justify-content-between align-items-center mb-3">
                                        <h6 class="mb-0">Customer Reviews</h6>
                                        <div class="dropdown">
                                            <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" 
                                                    data-bs-toggle="dropdown">
                                                Sort by: Newest
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li><a class="dropdown-item" href="#" onclick="sortReviews('newest')">Newest</a></li>
                                                <li><a class="dropdown-item" href="#" onclick="sortReviews('oldest')">Oldest</a></li>
                                                <li><a class="dropdown-item" href="#" onclick="sortReviews('highest')">Highest Rating</a></li>
                                                <li><a class="dropdown-item" href="#" onclick="sortReviews('lowest')">Lowest Rating</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div id="reviews-container">
                                        ${reviewsHtml}
                                    </div>
                                    
                                    ${ratingData.ratings.length > 10 ? `
                                        <div class="text-center mt-3">
                                            <button class="btn btn-outline-primary" onclick="loadMoreReviews(${productId})">
                                                <i class="fas fa-chevron-down me-1"></i>Load More Reviews
                                            </button>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Sort reviews functionality
function sortReviews(sortType) {
    // This function would re-render the reviews with different sorting
    const productId = parseInt(new URLSearchParams(window.location.search).get('id'));
    const ratingData = window.ratingManager.getProductRatingsWithDetails(productId);
    
    if (!ratingData || !ratingData.ratings) return;
    
    let sortedReviews = [...ratingData.ratings];
    
    switch(sortType) {
        case 'newest':
            sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            sortedReviews.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'highest':
            sortedReviews.sort((a, b) => b.rating - a.rating);
            break;
        case 'lowest':
            sortedReviews.sort((a, b) => a.rating - b.rating);
            break;
    }
    
    // Re-render reviews container
    let reviewsHtml = sortedReviews.slice(0, 10).map(review => {
        const reviewDate = new Date(review.date).toLocaleDateString();
        const isVerified = review.verified;
        
        return `
            <div class="review-item border-bottom py-3">
                <div class="d-flex align-items-start">
                    <div class="review-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style="width: 40px; height: 40px; font-size: 14px;">
                        ${review.userInitials}
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center mb-2">
                            <strong class="me-2">${review.userName}</strong>
                            ${isVerified ? '<span class="badge bg-success badge-sm me-2">Verified Purchase</span>' : ''}
                            <small class="text-muted">${reviewDate}</small>
                        </div>
                        <div class="rating mb-2">
                            ${window.ratingManager.generateStarDisplay(review.rating)}
                        </div>
                        ${review.review ? `
                            <p class="mb-0 text-muted">${review.review}</p>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    $('#reviews-container').html(reviewsHtml);
}

function loadMoreReviews(productId) {
    // This function would load more reviews (pagination)
    alert('Load more reviews functionality would be implemented here');
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('loggedInUser'));
}
