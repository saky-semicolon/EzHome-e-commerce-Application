$(document).ready(function() {
    // Load products from localStorage if available, otherwise use default products
    loadProducts();
    
    // Wait for products to be loaded
    setTimeout(function() {
        if (window.products && window.products.length > 0) {
            initializeHomePage();
        }
    }, 100);
});

function loadProducts() {
    // Check if updated products exist in localStorage
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        try {
            const parsedProducts = JSON.parse(storedProducts);
            if (parsedProducts && parsedProducts.length > 0) {
                window.products = parsedProducts;
                console.log('Loaded products from localStorage:', parsedProducts.length, 'products');
                return;
            }
        } catch (error) {
            console.error('Error parsing stored products:', error);
        }
    }
    
    // Fallback to default products if no stored products or error
    console.log('Using default products from products.js');
}

function initializeHomePage() {
    const products = window.products;
    const featuredProducts = window.getFeaturedProducts();
    
    // Populate carousel with featured products
    populateCarousel(featuredProducts);
    
    // Populate shop by category
    populateCategories(products);
    
    // Display all products initially
    if (window.displayAllProducts) {
        window.displayAllProducts();
    }
}

function populateCarousel(featuredProducts) {
    const carouselInner = $('#featured-products-carousel .carousel-inner');
    carouselInner.empty();
    
    if (featuredProducts.length === 0) {
        carouselInner.append(`
            <div class="carousel-item active">
                <div class="d-flex justify-content-center align-items-center" style="height: 300px; background-color: #f8f9fa;">
                    <h3 class="text-muted">Featured Products Coming Soon</h3>
                </div>
            </div>
        `);
        return;
    }

    featuredProducts.slice(0, 5).forEach((product, index) => {
        const imageUrl = product.image || product.image_url || 'images/placeholder.jpg';
        const price = product.price_sgd || product.price || 0;
        
        const carouselItem = `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <div class="row align-items-center" style="min-height: 300px;">
                    <div class="col-md-6">
                        <img src="${imageUrl}" class="img-fluid rounded" alt="${product.name}" style="max-height: 250px; object-fit: cover;" onerror="this.src='images/placeholder.jpg'">
                    </div>
                    <div class="col-md-6">
                        <div class="carousel-caption-custom text-dark">
                            <h3>${product.name}</h3>
                            <p class="lead">${product.description}</p>
                            <div class="mb-2">
                                <span class="badge bg-primary">${product.category}</span>
                                ${product.family ? `<span class="badge bg-secondary">${product.family}</span>` : ''}
                            </div>
                            <div class="mb-3">
                                <h4 class="text-success">$${price.toFixed(2)}</h4>
                            </div>
                            <div class="btn-group">
                                <a href="product.html?id=${product.id}" class="btn btn-primary">View Details</a>
                                <button class="btn btn-success add-to-cart" data-id="${product.id}">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        carouselInner.append(carouselItem);
    });
}

function populateCategories(products) {
    const categoryLinks = $('#category-links');
    categoryLinks.empty();
    
    const categories = [...new Set(products.map(p => p.category))];
    
    // Add "All Products" option
    categoryLinks.append(`
        <a href="#" class="list-group-item list-group-item-action category-link" data-category="all">
            <strong>All Products</strong> (${products.length} items)
        </a>
    `);
    
    categories.forEach(category => {
        const categoryCount = products.filter(p => p.category === category).length;
        const categoryLink = `
            <a href="#" class="list-group-item list-group-item-action category-link" data-category="${category}">
                ${category} (${categoryCount} items)
            </a>
        `;
        categoryLinks.append(categoryLink);
    });

    // Category link click handler
    $(document).on('click', '.category-link', function(e) {
        e.preventDefault();
        const category = $(this).data('category');
        
        // Remove active class from all links and add to clicked one
        $('.category-link').removeClass('active');
        $(this).addClass('active');
        
        // Scroll to products section
        $('html, body').animate({
            scrollTop: $('#products').offset().top - 100
        }, 500);
        
        if (category === 'all') {
            window.displayAllProducts();
        } else {
            window.displayProductsByCategory(category);
        }
    });
}