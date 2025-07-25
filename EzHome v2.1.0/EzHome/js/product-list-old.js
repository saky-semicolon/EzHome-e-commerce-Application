$(document).ready(function() {
    // Load products from localStorage if available, otherwise use default products
    loadProducts();
    
    // Wait for products to be loaded
    setTimeout(function() {
        if (window.products && window.products.length > 0) {
            displayAllProducts();
        } else {
            $('#product-list').html('<p class="text-center">No products found.</p>');
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

function displayAllProducts() {
    const products = window.products;
    const productList = $('#product-list');
    productList.empty();

    products.forEach(product => {
        const productCard = createProductCard(product);
        productList.append(productCard);
    });
}

function displayProductsByCategory(category) {
    const products = window.getProductsByCategory(category);
    const productList = $('#product-list');
    productList.empty();

    if (products.length > 0) {
        products.forEach(product => {
            const productCard = createProductCard(product);
            productList.append(productCard);
        });
    } else {
        productList.html('<p class="text-center">No products found in this category.</p>');
    }
}

function createProductCard(product) {
    const stars = '★'.repeat(Math.floor(product.rating || 4)) + '☆'.repeat(5 - Math.floor(product.rating || 4));
    const imageUrl = product.image || product.image_url || 'images/placeholder.jpg';
    const price = product.price_sgd || product.price || 0;
    const stockStatus = getStockStatus(product.stock);
    
    return $(`
        <div class="col-md-4 col-lg-3 mb-4">
            <div class="card h-100 product-card">
                <img src="${imageUrl}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;" onerror="this.src='images/placeholder.jpg'">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted small">${product.description}</p>
                    <div class="product-details mb-2">
                        <small class="text-muted">
                            <strong>Category:</strong> ${product.category}<br>
                            ${product.family ? `<strong>Family:</strong> ${product.family}<br>` : ''}
                            ${product.colors && product.colors.length ? `<strong>Colors:</strong> ${product.colors.join(', ')}` : ''}
                        </small>
                    </div>
                    <div class="rating mb-2">
                        <span class="text-warning">${stars}</span>
                        <small class="text-muted">(${product.rating || 4})</small>
                    </div>
                    ${stockStatus.html}
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="h5 mb-0 text-primary">$${price.toFixed(2)}</span>
                        </div>
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary btn-sm add-to-cart" data-product-id="${product.id}" ${stockStatus.disabled}>
                                <i class="fas fa-shopping-cart me-1"></i>Add to Cart
                            </button>
                            <a href="product.html?id=${product.id}" class="btn btn-outline-secondary btn-sm">
                                <i class="fas fa-eye me-1"></i>View Details
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function getStockStatus(stock) {
    if (stock === undefined || stock === null) {
        return { html: '', disabled: '' };
    }
    
    if (stock === 0) {
        return { 
            html: '<div class="mb-2"><span class="badge bg-danger">Out of Stock</span></div>',
            disabled: 'disabled'
        };
    } else if (stock <= 10) {
        return { 
            html: `<div class="mb-2"><span class="badge bg-warning text-dark">Only ${stock} left!</span></div>`,
            disabled: ''
        };
    } else {
        return { 
            html: '<div class="mb-2"><span class="badge bg-success">In Stock</span></div>',
            disabled: ''
        };
    }
}
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="text-success mb-0">$${product.price.toFixed(2)}</h5>
                            <span class="badge ${product.in_stock ? 'bg-success' : 'bg-danger'}">
                                ${product.in_stock ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>
                        <div class="btn-group w-100" role="group">
                            <a href="product.html?id=${product.id}" class="btn btn-outline-primary btn-sm">Details</a>
                            <button class="btn btn-success btn-sm add-to-cart" data-id="${product.id}" ${!product.in_stock ? 'disabled' : ''}>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
}

// Make functions globally available
window.displayAllProducts = displayAllProducts;
window.displayProductsByCategory = displayProductsByCategory;