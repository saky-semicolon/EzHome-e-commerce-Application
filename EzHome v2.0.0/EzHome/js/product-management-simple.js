$(document).ready(function() {
    // Check if user is admin
    const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!currentUser || currentUser.role !== 'Admin') {
        showAdminLogin();
        return;
    }

    // Initialize the page
    initProductManagement();
});

function showAdminLogin() {
    const loginHTML = `
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header bg-primary text-white text-center">
                            <h5><i class="fas fa-shield-alt me-2"></i>Admin Login Required</h5>
                        </div>
                        <div class="card-body">
                            <form id="admin-login-form">
                                <div class="mb-3">
                                    <label class="form-label">Username</label>
                                    <input type="text" class="form-control" id="admin-username" value="admin" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Password</label>
                                    <input type="password" class="form-control" id="admin-password" value="admin123" required>
                                </div>
                                <button type="submit" class="btn btn-primary w-100">Login</button>
                            </form>
                            <div class="mt-3 text-center">
                                <small class="text-muted">Default: admin / admin123</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('body').html(loginHTML);
    
    $('#admin-login-form').on('submit', function(e) {
        e.preventDefault();
        const username = $('#admin-username').val();
        const password = $('#admin-password').val();
        
        if (username === 'admin' && password === 'admin123') {
            const adminUser = {
                username: 'admin',
                password: 'admin123',
                role: 'Admin',
                email: 'admin@ezhome.com'
            };
            localStorage.setItem('loggedInUser', JSON.stringify(adminUser));
            location.reload();
        } else {
            alert('Invalid credentials');
        }
    });
}

function initProductManagement() {
    createSampleProducts();
    loadProducts();
    updateStats();
    setupEventListeners();
}

function createSampleProducts() {
    if (!localStorage.getItem('products')) {
        const sampleProducts = [
            {
                id: 1,
                name: 'Smart LED Bulb Set',
                category: 'Lighting',
                price: 79.99,
                stock: 25,
                description: 'Energy-efficient smart LED bulbs with color changing capabilities',
                image: 'images/Smart LED Bulb Set.JPG'
            },
            {
                id: 2,
                name: 'Smart Thermostat Pro',
                category: 'Climate',
                price: 299.99,
                stock: 15,
                description: 'Advanced programmable thermostat with learning capabilities',
                image: 'images/Smart Thermostat Pro.JPG'
            },
            {
                id: 3,
                name: 'Smart Door Lock',
                category: 'Security',
                price: 199.99,
                stock: 8,
                description: 'Keyless entry smart lock with multiple access methods',
                image: 'images/Smart Door Lock.JPG'
            },
            {
                id: 4,
                name: 'Smart Security Camera',
                category: 'Security',
                price: 149.99,
                stock: 20,
                description: '1080p HD security camera with night vision',
                image: 'images/Smart Security Camera.JPG'
            },
            {
                id: 5,
                name: 'Smart Air Purifier',
                category: 'Climate',
                price: 399.99,
                stock: 0,
                description: 'HEPA air purifier with smart monitoring',
                image: 'images/Smart Air Purifier.PNG'
            },
            {
                id: 6,
                name: 'Smart Motion Sensor',
                category: 'Automation',
                price: 59.99,
                stock: 30,
                description: 'PIR motion sensor for home automation',
                image: 'images/Smart Motion Sensor.JPG'
            }
        ];
        localStorage.setItem('products', JSON.stringify(sampleProducts));
    }
}

function setupEventListeners() {
    // Search functionality
    $('#search-input').on('keyup', function() {
        loadProducts();
    });
    
    // Category filter
    $('#category-filter').on('change', function() {
        loadProducts();
    });
    
    // Add product form
    $('#add-product-form').on('submit', function(e) {
        e.preventDefault();
        addProduct();
    });
    
    // Edit product form
    $('#edit-product-form').on('submit', function(e) {
        e.preventDefault();
        updateProduct();
    });
    
    // Logout
    $('#logout-btn').on('click', function() {
        localStorage.removeItem('loggedInUser');
        showSuccess('Logged out successfully!');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    });
}

function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const searchTerm = $('#search-input').val().toLowerCase();
    const categoryFilter = $('#category-filter').val();
    
    // Filter products
    let filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });
    
    renderProducts(filteredProducts);
}

function renderProducts(products) {
    const tbody = $('#products-table');
    tbody.empty();
    
    if (products.length === 0) {
        tbody.append(`
            <tr>
                <td colspan="7" class="text-center py-4">
                    <i class="fas fa-search fa-2x text-muted mb-2"></i><br>
                    <span class="text-muted">No products found</span>
                </td>
            </tr>
        `);
        return;
    }
    
    products.forEach(product => {
        const stockStatus = getStockStatus(product.stock);
        tbody.append(`
            <tr>
                <td>
                    <img src="${product.image}" alt="${product.name}" class="product-img" 
                         onerror="this.src='images/placeholder.png'">
                </td>
                <td>
                    <div>
                        <strong>${product.name}</strong><br>
                        <small class="text-muted">${product.description.substring(0, 50)}...</small>
                    </div>
                </td>
                <td><span class="badge bg-info">${product.category}</span></td>
                <td><strong>$${product.price.toFixed(2)}</strong></td>
                <td>
                    <input type="number" class="form-control form-control-sm" style="width: 80px;" 
                           value="${product.stock}" onchange="updateStock(${product.id}, this.value)">
                </td>
                <td><span class="stock-badge ${stockStatus.class}">${stockStatus.text}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editProduct(${product.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${product.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `);
    });
}

function getStockStatus(stock) {
    if (stock === 0) return { text: 'Out of Stock', class: 'stock-out' };
    if (stock <= 10) return { text: 'Low Stock', class: 'stock-low' };
    return { text: 'In Stock', class: 'stock-in' };
}

function updateStats() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    const total = products.length;
    const inStock = products.filter(p => p.stock > 10).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    
    $('#total-products').text(total);
    $('#in-stock').text(inStock);
    $('#low-stock').text(lowStock);
    $('#out-of-stock').text(outOfStock);
}

function addProduct() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
    
    const newProduct = {
        id: maxId + 1,
        name: $('#add-name').val(),
        category: $('#add-category').val(),
        price: parseFloat($('#add-price').val()),
        stock: parseInt($('#add-stock').val()),
        description: $('#add-description').val(),
        image: $('#add-image').val() || 'images/placeholder.png'
    };
    
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    
    $('#addProductModal').modal('hide');
    $('#add-product-form')[0].reset();
    
    loadProducts();
    updateStats();
    showSuccess('Product added successfully!');
}

function editProduct(id) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === id);
    
    if (product) {
        $('#edit-id').val(product.id);
        $('#edit-name').val(product.name);
        $('#edit-category').val(product.category);
        $('#edit-price').val(product.price);
        $('#edit-stock').val(product.stock);
        $('#edit-description').val(product.description);
        $('#edit-image').val(product.image);
        
        $('#editProductModal').modal('show');
    }
}

function updateProduct() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const id = parseInt($('#edit-id').val());
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex !== -1) {
        products[productIndex] = {
            ...products[productIndex],
            name: $('#edit-name').val(),
            category: $('#edit-category').val(),
            price: parseFloat($('#edit-price').val()),
            stock: parseInt($('#edit-stock').val()),
            description: $('#edit-description').val(),
            image: $('#edit-image').val() || 'images/placeholder.png'
        };
        
        localStorage.setItem('products', JSON.stringify(products));
        
        $('#editProductModal').modal('hide');
        
        loadProducts();
        updateStats();
        showSuccess('Product updated successfully!');
    }
}

function updateStock(id, newStock) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex !== -1) {
        products[productIndex].stock = parseInt(newStock) || 0;
        localStorage.setItem('products', JSON.stringify(products));
        
        loadProducts();
        updateStats();
        showSuccess('Stock updated!');
    }
}

function deleteProduct(id) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === id);
    
    if (product && confirm(`Are you sure you want to delete "${product.name}"?`)) {
        const updatedProducts = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        
        loadProducts();
        updateStats();
        showSuccess('Product deleted successfully!');
    }
}

function showSuccess(message) {
    // Remove any existing alerts
    $('.alert-success').remove();
    
    const alert = $(`
        <div class="alert alert-success alert-dismissible fade show position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
            <i class="fas fa-check-circle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    
    $('body').append(alert);
    
    setTimeout(() => {
        alert.alert('close');
    }, 3000);
}
