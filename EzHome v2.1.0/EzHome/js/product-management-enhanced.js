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

    initializeProductDashboard();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
});

function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleString();
    $('#current-time').text(timeString);
}

function initializeProductDashboard() {
    initializeProductManagement();
    updateProductStats();
    initializeTabNavigation();
    initializeSearch();
    
    // Show success message
    showSuccessAlert('Welcome to Product Management Dashboard!');
}

function updateProductStats() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    const totalProducts = products.length;
    const inStockProducts = products.filter(product => product.stock > 10).length;
    const lowStockProducts = products.filter(product => product.stock > 0 && product.stock <= 10).length;
    const outOfStockProducts = products.filter(product => product.stock === 0).length;
    
    // Animate the numbers
    animateNumber('#total-products', totalProducts);
    animateNumber('#in-stock-products', inStockProducts);
    animateNumber('#low-stock-products', lowStockProducts);
    animateNumber('#out-of-stock-products', outOfStockProducts);
}

function animateNumber(selector, targetNumber) {
    const element = $(selector);
    const duration = 1000;
    const startTime = Date.now();
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentNumber = Math.floor(progress * targetNumber);
        
        element.text(currentNumber);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    update();
}

function initializeTabNavigation() {
    $('.nav-pills .nav-link[data-tab]').on('click', function(e) {
        e.preventDefault();
        
        // Update active nav link
        $('.nav-pills .nav-link').removeClass('active');
        $(this).addClass('active');
        
        // Show corresponding tab content
        const tabName = $(this).data('tab');
        $('.tab-pane').removeClass('active');
        $(`#${tabName}-tab`).addClass('active');
    });
    
    // Logout functionality
    $('#logout-btn').on('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('loggedInUser');
        showSuccessAlert('Logged out successfully!');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    });
}

function initializeSearch() {
    $('#product-search').on('keyup', function() {
        filterProducts();
    });
    
    $('#category-filter, #stock-filter').on('change', function() {
        filterProducts();
    });
}

function filterProducts() {
    const searchTerm = $('#product-search').val().toLowerCase();
    const categoryFilter = $('#category-filter').val();
    const stockFilter = $('#stock-filter').val();
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    let filteredProducts = products;
    
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    if (categoryFilter) {
        filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
    }
    
    if (stockFilter) {
        switch (stockFilter) {
            case 'in-stock':
                filteredProducts = filteredProducts.filter(product => product.stock > 10);
                break;
            case 'low-stock':
                filteredProducts = filteredProducts.filter(product => product.stock > 0 && product.stock <= 10);
                break;
            case 'out-of-stock':
                filteredProducts = filteredProducts.filter(product => product.stock === 0);
                break;
        }
    }
    
    renderFilteredProducts(filteredProducts);
}

function renderFilteredProducts(products) {
    const productList = $('#product-list');
    productList.empty();
    
    if (products.length === 0) {
        productList.append(`
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    <i class="fas fa-search fa-2x mb-2"></i><br>
                    No products found matching your criteria.
                </td>
            </tr>
        `);
        return;
    }
    
    products.forEach(product => {
        let stockStatus = 'in';
        let stockClass = 'stock-in';
        
        if (product.stock === 0) {
            stockStatus = 'out';
            stockClass = 'stock-out';
        } else if (product.stock <= 10) {
            stockStatus = 'low';
            stockClass = 'stock-low';
        }
        
        const imagePath = product.image ? `images/${product.image}` : 'images/placeholder.png';
        
        productList.append(`
            <tr class="user-row" data-product-id="${product.id}">
                <td>
                    <img src="${imagePath}" alt="${product.name}" class="product-image" onerror="this.src='images/placeholder.png'">
                </td>
                <td>
                    <div>
                        <strong>${product.name}</strong><br>
                        <small class="text-muted">${product.description || 'No description available'}</small>
                    </div>
                </td>
                <td>
                    <span class="category-badge">${product.category}</span>
                </td>
                <td>
                    <strong>$${parseFloat(product.price).toFixed(2)}</strong>
                </td>
                <td>
                    <span class="fw-bold">${product.stock}</span>
                </td>
                <td>
                    <span class="stock-badge ${stockClass}">${stockStatus === 'in' ? 'In Stock' : stockStatus === 'low' ? 'Low Stock' : 'Out of Stock'}</span>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary edit-product" data-product-id="${product.id}" title="Edit Product" style="border-radius: 8px 0 0 8px;">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-product" data-product-id="${product.id}" title="Delete Product" style="border-radius: 0 8px 8px 0;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `);
    });
}

function initializeProductManagement() {
    // Create sample products if none exist
    createSampleProducts();
    
    const productList = $('#product-list');

    function renderProducts() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        renderFilteredProducts(products);
        updateProductStats();
    }

    // Add product
    $('#add-product-form').on('submit', function(e) {
        e.preventDefault();
        const products = JSON.parse(localStorage.getItem('products')) || [];
        
        const name = $('#add-product-name').val().trim();
        
        // Check if product name already exists
        if (products.find(product => product.name.toLowerCase() === name.toLowerCase())) {
            showErrorAlert('Product name already exists!');
            return;
        }
        
        const newProduct = {
            id: generateProductId(),
            name: name,
            category: $('#add-product-category').val(),
            price: parseFloat($('#add-product-price').val()),
            stock: parseInt($('#add-product-stock').val()),
            image: $('#add-product-image-path').val().trim() || null,
            description: $('#add-product-description').val().trim() || '',
            features: $('#add-product-features').val().trim() || '',
            specifications: $('#add-product-specifications').val().trim() || '',
            createdDate: new Date().toISOString()
        };
        
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
        $('#addProductModal').modal('hide');
        $('#add-product-form')[0].reset();
        
        // Clear image preview
        $('#add-image-preview').html('<i class="fas fa-image fa-2x text-muted"></i>');
        
        showSuccessAlert(`Product "${name}" added successfully!`);
    });

    // Edit product
    productList.on('click', '.edit-product', function() {
        const productId = $(this).data('product-id');
        let products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products.find(p => p.id === productId);
        
        if (product) {
            // Populate edit form
            $('#edit-product-id').val(productId);
            $('#edit-product-name').val(product.name);
            $('#edit-product-category').val(product.category);
            $('#edit-product-price').val(product.price);
            $('#edit-product-stock').val(product.stock);
            $('#edit-product-image-path').val(product.image || '');
            $('#edit-product-description').val(product.description || '');
            $('#edit-product-features').val(product.features || '');
            
            // Update image preview
            if (product.image) {
                const imagePath = `images/${product.image}`;
                $('#edit-image-preview').html(`
                    <img src="${imagePath}" alt="${product.name}" 
                         style="max-width: 100%; max-height: 90px; object-fit: contain; border-radius: 4px;"
                         onerror="this.parentElement.innerHTML='<i class=\\"fas fa-image fa-2x text-muted\\"></i>'">
                `);
            } else {
                $('#edit-image-preview').html('<i class="fas fa-image fa-2x text-muted"></i>');
            }
            
            $('#editProductModal').modal('show');
        }
    });
    
    // Save edited product
    $('#edit-product-form').on('submit', function(e) {
        e.preventDefault();
        const productId = $('#edit-product-id').val();
        let products = JSON.parse(localStorage.getItem('products')) || [];
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex !== -1) {
            const name = $('#edit-product-name').val().trim();
            
            // Check if product name already exists (excluding current product)
            const existingProduct = products.find(p => p.name.toLowerCase() === name.toLowerCase() && p.id !== productId);
            if (existingProduct) {
                showErrorAlert('Product name already exists!');
                return;
            }
            
            products[productIndex].name = name;
            products[productIndex].category = $('#edit-product-category').val();
            products[productIndex].price = parseFloat($('#edit-product-price').val());
            products[productIndex].stock = parseInt($('#edit-product-stock').val());
            products[productIndex].image = $('#edit-product-image-path').val().trim() || null;
            products[productIndex].description = $('#edit-product-description').val().trim() || '';
            products[productIndex].features = $('#edit-product-features').val().trim() || '';
            products[productIndex].lastUpdated = new Date().toISOString();
            
            localStorage.setItem('products', JSON.stringify(products));
            renderProducts();
            $('#editProductModal').modal('hide');
            showSuccessAlert(`Product "${name}" updated successfully!`);
        }
    });

    // Delete product with confirmation
    productList.on('click', '.delete-product', function() {
        const productId = $(this).data('product-id');
        let products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products.find(p => p.id === productId);
        
        if (product && confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
            products = products.filter(p => p.id !== productId);
            localStorage.setItem('products', JSON.stringify(products));
            renderProducts();
            showSuccessAlert(`Product "${product.name}" deleted successfully!`);
        }
    });

    // Initial render
    renderProducts();
}

function generateProductId() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const existingIds = products.map(p => parseInt(p.id.replace('PRD', ''))).filter(id => !isNaN(id));
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    return `PRD${String(maxId + 1).padStart(3, '0')}`;
}

function createSampleProducts() {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    if (products.length === 0) {
        const sampleProducts = [
            {
                id: 'PRD001',
                name: 'Smart LED Bulb Set',
                category: 'Lighting',
                price: 79.99,
                stock: 25,
                image: 'Smart LED Bulb Set.JPG',
                description: 'Energy-efficient smart LED bulbs with color changing capabilities',
                features: 'WiFi enabled, Voice control, Energy saving, 16 million colors',
                specifications: '9W, E27 base, 800 lumens, 2.4GHz WiFi',
                createdDate: new Date().toISOString()
            },
            {
                id: 'PRD002',
                name: 'Smart Thermostat Pro',
                category: 'Climate',
                price: 299.99,
                stock: 15,
                image: 'Smart Thermostat Pro.JPG',
                description: 'Advanced programmable thermostat with learning capabilities',
                features: 'Learning algorithm, Remote control, Energy reports, Geofencing',
                specifications: 'WiFi, Touch screen, 24V power, Compatible with most HVAC',
                createdDate: new Date().toISOString()
            },
            {
                id: 'PRD003',
                name: 'Smart Door Lock',
                category: 'Security',
                price: 199.99,
                stock: 8,
                image: 'Smart Door Lock.JPG',
                description: 'Keyless entry smart lock with multiple access methods',
                features: 'Fingerprint, PIN code, Mobile app, Auto-lock',
                specifications: 'Bluetooth 5.0, Battery powered, Weather resistant',
                createdDate: new Date().toISOString()
            },
            {
                id: 'PRD004',
                name: 'Smart Security Camera',
                category: 'Security',
                price: 149.99,
                stock: 20,
                image: 'Smart Security Camera.JPG',
                description: '1080p HD security camera with night vision',
                features: '1080p HD, Night vision, Motion detection, Cloud storage',
                specifications: '1080p resolution, 140° viewing angle, IP65 waterproof',
                createdDate: new Date().toISOString()
            },
            {
                id: 'PRD005',
                name: 'Smart Air Purifier',
                category: 'Climate',
                price: 399.99,
                stock: 0,
                image: 'Smart Air Purifier.PNG',
                description: 'HEPA air purifier with smart monitoring',
                features: 'HEPA filter, Air quality monitoring, Auto mode, App control',
                specifications: 'CADR 300m³/h, Room size up to 40m², Noise level <45dB',
                createdDate: new Date().toISOString()
            },
            {
                id: 'PRD006',
                name: 'Smart Motion Sensor',
                category: 'Automation',
                price: 59.99,
                stock: 30,
                image: 'Smart Motion Sensor.JPG',
                description: 'PIR motion sensor for home automation',
                features: 'PIR technology, Wide detection range, Battery powered, Wireless',
                specifications: '120° detection angle, 7m range, 2-year battery life',
                createdDate: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('products', JSON.stringify(sampleProducts));
    }
}

function showAdminLoginPopup() {
    const loginModalHTML = `
        <div class="modal fade" id="adminLoginModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="border-radius: 20px; border: none; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15); overflow: hidden;">
                    <div class="modal-header text-white border-0" style="background: var(--primary-gradient); padding: 2rem;">
                        <div class="text-center w-100">
                            <i class="fas fa-shield-alt fa-3x mb-3"></i>
                            <h4 class="modal-title fw-bold mb-2">Admin Access Required</h4>
                            <p class="mb-0 opacity-75">Secure login to Product Management</p>
                        </div>
                    </div>
                    <div class="modal-body p-4" style="background: rgba(255, 255, 255, 0.95);">
                        <div class="alert" style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); border: 1px solid rgba(102, 126, 234, 0.2); border-radius: 12px;">
                            <i class="fas fa-info-circle me-2 text-primary"></i>
                            Please enter admin credentials to access the product management system.
                        </div>
                        <form id="admin-login-form">
                            <div class="mb-3">
                                <label for="admin-username" class="form-label fw-semibold">
                                    <i class="fas fa-user me-1"></i>Username
                                </label>
                                <input type="text" class="form-control search-box" id="admin-username" placeholder="Enter username" required>
                            </div>
                            <div class="mb-3">
                                <label for="admin-password" class="form-label fw-semibold">
                                    <i class="fas fa-lock me-1"></i>Password
                                </label>
                                <input type="password" class="form-control search-box" id="admin-password" placeholder="Enter password" required>
                            </div>
                            <div id="login-error" class="alert alert-danger d-none" style="border-radius: 12px;">
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                Invalid credentials. Please try again.
                            </div>
                        </form>
                        <div class="mt-4 p-3" style="background: rgba(102, 126, 234, 0.05); border-radius: 12px;">
                            <small class="text-muted">
                                <i class="fas fa-lightbulb me-1"></i>
                                <strong>Default credentials:</strong> admin / admin123
                            </small>
                        </div>
                    </div>
                    <div class="modal-footer border-0 p-4" style="background: rgba(255, 255, 255, 0.95);">
                        <button type="button" class="btn btn-light" id="cancel-login" style="border-radius: 12px; padding: 0.75rem 1.5rem;">
                            <i class="fas fa-times me-1"></i>Cancel
                        </button>
                        <button type="submit" form="admin-login-form" class="btn btn-gradient">
                            <i class="fas fa-sign-in-alt me-1"></i>Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal to page
    $('body').append(loginModalHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('adminLoginModal'));
    modal.show();

    // Handle form submission
    $('#admin-login-form').on('submit', function(e) {
        e.preventDefault();
        
        const username = $('#admin-username').val();
        const password = $('#admin-password').val();
        
        // Check credentials
        if (username === 'admin' && password === 'admin123') {
            let users = JSON.parse(localStorage.getItem('users')) || [];
            let adminUser = users.find(user => user.username === 'admin');
            
            if (!adminUser) {
                adminUser = {
                    username: 'admin',
                    password: 'admin123',
                    role: 'Admin',
                    email: 'admin@ezhome.com',
                    phone: '555-0001',
                    address: 'EzHome HQ, Tech City'
                };
                users.push(adminUser);
                localStorage.setItem('users', JSON.stringify(users));
            }
            
            localStorage.setItem('loggedInUser', JSON.stringify(adminUser));
            
            modal.hide();
            $('#adminLoginModal').remove();
            
            showSuccessAlert('Successfully logged in as Admin!');
            
            setTimeout(() => {
                initializeProductDashboard();
            }, 500);
            
        } else {
            $('#login-error').removeClass('d-none');
            $('#admin-username, #admin-password').addClass('is-invalid');
            
            setTimeout(() => {
                $('#login-error').addClass('d-none');
                $('#admin-username, #admin-password').removeClass('is-invalid');
            }, 3000);
        }
    });

    // Handle cancel button
    $('#cancel-login').on('click', function() {
        modal.hide();
        $('#adminLoginModal').remove();
        window.location.href = 'index.html';
    });

    // Auto-focus on username field
    $('#adminLoginModal').on('shown.bs.modal', function() {
        $('#admin-username').focus();
    });
}

function showSuccessAlert(message) {
    const alertHTML = `
        <div class="alert alert-success alert-dismissible fade show position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; min-width: 300px; border-radius: 12px; border: none; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
            <i class="fas fa-check-circle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $('body').append(alertHTML);
    
    setTimeout(() => {
        $('.alert-success').alert('close');
    }, 3000);
}

function showErrorAlert(message) {
    const alertHTML = `
        <div class="alert alert-danger alert-dismissible fade show position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; min-width: 300px; border-radius: 12px; border: none; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);">
            <i class="fas fa-exclamation-triangle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $('body').append(alertHTML);
    
    setTimeout(() => {
        $('.alert-danger').alert('close');
    }, 4000);
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('loggedInUser'));
}

// Image upload handling function
function handleImageUpload(input, type) {
    const file = input.files[0];
    if (!file) return;
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        showErrorAlert('Please select a valid image file (JPG, PNG, or GIF).');
        input.value = '';
        return;
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        showErrorAlert('File size too large. Please select an image smaller than 5MB.');
        input.value = '';
        return;
    }
    
    // Generate filename and update the path input
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `product_${timestamp}.${extension}`;
    
    // Update the corresponding path input
    if (type === 'add') {
        $('#add-product-image-path').val(filename);
        updateImagePreview('#add-image-preview', file);
    } else if (type === 'edit') {
        $('#edit-product-image-path').val(filename);
        updateImagePreview('#edit-image-preview', file);
    }
    
    showSuccessAlert('Image selected successfully! The filename has been set.');
}

// Update image preview
function updateImagePreview(previewSelector, file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        $(previewSelector).html(`
            <img src="${e.target.result}" alt="Preview" 
                 style="max-width: 100%; max-height: 90px; object-fit: contain; border-radius: 4px;">
        `);
    };
    reader.readAsDataURL(file);
}
