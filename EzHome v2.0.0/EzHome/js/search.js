$(document).ready(function() {
    // Wait for products to be loaded
    setTimeout(function() {
        if (window.products && window.products.length > 0) {
            initializeSearch();
        }
    }, 100);
});

function initializeSearch() {
    const searchResults = $('#search-results');
    const searchInput = $('#search-input');
    const searchButton = $('#search-button');

    function displaySearchResults(productsToDisplay) {
        searchResults.empty();
        
        if (productsToDisplay.length === 0) {
            searchResults.html(`
                <div class="col-12">
                    <div class="alert alert-info text-center">
                        <i class="fas fa-search"></i>
                        <h5>No products found</h5>
                        <p>Try searching with different keywords or browse our categories above.</p>
                    </div>
                </div>
            `);
            return;
        }

        // Add search results header
        searchResults.append(`
            <div class="col-12 mb-3">
                <h4>Search Results (${productsToDisplay.length} ${productsToDisplay.length === 1 ? 'product' : 'products'} found)</h4>
                <hr>
            </div>
        `);

        productsToDisplay.forEach(product => {
            const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
            
            const productCard = `
                <div class="col-md-4 col-lg-3 mb-4">
                    <div class="card h-100 product-card">
                        <img src="${product.image_url}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text text-muted small">${product.description}</p>
                            <div class="mb-2">
                                <span class="badge bg-primary">${product.category}</span>
                                <span class="badge bg-secondary">${product.family}</span>
                            </div>
                            <div class="rating mb-2">
                                <span class="text-warning">${stars}</span>
                                <small class="text-muted">(${product.rating})</small>
                            </div>
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
            `;
            searchResults.append(productCard);
        });
    }

    function performSearch() {
        const query = searchInput.val().trim();
        
        if (!query) {
            searchResults.empty();
            return;
        }

        const filteredProducts = window.searchProducts(query);
        displaySearchResults(filteredProducts);
        
        // Scroll to results
        if (filteredProducts.length > 0) {
            $('html, body').animate({
                scrollTop: $('#product-search').offset().top - 100
            }, 500);
        }
    }

    // Search button click handler
    searchButton.on('click', performSearch);

    // Enter key handler for search input
    searchInput.on('keypress', function(e) {
        if (e.which === 13) { // Enter key
            performSearch();
        }
    });

    // Real-time search (optional - debounced)
    let searchTimeout;
    searchInput.on('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function() {
            const query = searchInput.val().trim();
            if (query.length >= 2) {
                performSearch();
            } else if (query.length === 0) {
                searchResults.empty();
            }
        }, 300);
    });
}