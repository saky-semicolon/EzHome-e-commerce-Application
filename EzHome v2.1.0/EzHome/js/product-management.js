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
        
        // Show info about default admin
        console.log('Default admin user created - Username: admin, Password: admin123');
    }

    const currentUser = getCurrentUser();

    // Show login popup if not admin
    if (!currentUser || currentUser.role !== 'Admin') {
        showAdminLoginPopup();
        return;
    }

    initializeProductManagement();
});

function showAdminLoginPopup() {
    // Create modal HTML
    const loginModalHTML = `
        <div class="modal fade" id="adminLoginModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">
                            <i class="fas fa-shield-alt me-2"></i>Admin Access Required
                        </h5>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            Please enter admin credentials to access the product management system.
                        </div>
                        <form id="admin-login-form">
                            <div class="mb-3">
                                <label for="admin-username" class="form-label">
                                    <i class="fas fa-user me-1"></i>Username
                                </label>
                                <input type="text" class="form-control" id="admin-username" placeholder="Enter username" required>
                            </div>
                            <div class="mb-3">
                                <label for="admin-password" class="form-label">
                                    <i class="fas fa-lock me-1"></i>Password
                                </label>
                                <input type="password" class="form-control" id="admin-password" placeholder="Enter password" required>
                            </div>
                            <div id="login-error" class="alert alert-danger d-none">
                                <i class="fas fa-exclamation-triangle me-2"></i>
                                Invalid credentials. Please try again.
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancel-login">
                            <i class="fas fa-times me-1"></i>Cancel
                        </button>
                        <button type="submit" form="admin-login-form" class="btn btn-primary">
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
            // Create/get admin user
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
            
            // Login the admin user
            localStorage.setItem('loggedInUser', JSON.stringify(adminUser));
            
            // Hide modal and initialize product management
            modal.hide();
            $('#adminLoginModal').remove();
            
            // Show success message
            showSuccessAlert('Successfully logged in as Admin!');
            
            // Initialize product management
            setTimeout(initializeProductManagement, 500);
            
        } else {
            // Show error
            $('#login-error').removeClass('d-none');
            $('#admin-username, #admin-password').addClass('is-invalid');
            
            // Clear error after 3 seconds
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
             style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
            <i class="fas fa-check-circle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $('body').append(alertHTML);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
        $('.alert-success').alert('close');
    }, 3000);
}

function showErrorAlert(message) {
    const alertHTML = `
        <div class="alert alert-danger alert-dismissible fade show position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
            <i class="fas fa-exclamation-triangle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $('body').append(alertHTML);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        $('.alert-danger').alert('close');
    }, 5000);
}

function initializeProductManagement() {
    const productList = $('#product-list');
    let filteredProducts = [];

    // Initialize products with stock property if not present
    function initializeProducts() {
        let products = getProducts();
        let updated = false;
        
        products.forEach(product => {
            if (product.stock === undefined) {
                product.stock = Math.floor(Math.random() * 50) + 10; // Random stock between 10-60
                updated = true;
            }
            // Ensure price_sgd property exists
            if (!product.price_sgd && product.price) {
                product.price_sgd = product.price;
                updated = true;
            }
            // Ensure image property exists
            if (!product.image && product.image_url) {
                product.image = product.image_url;
                updated = true;
            }
        });
        
        if (updated) {
            saveProducts(products);
        }
        
        return products;
    }

    function updateStats() {
        const products = getProducts();
        const totalProducts = products.length;
        const inStockProducts = products.filter(p => p.stock > 10).length;
        const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10).length;
        const outOfStockProducts = products.filter(p => p.stock === 0).length;

        $('#total-products').text(totalProducts);
        $('#in-stock-products').text(inStockProducts);
        $('#low-stock-products').text(lowStockProducts);
        $('#out-of-stock-products').text(outOfStockProducts);
    }

    function getStockStatus(stock) {
        if (stock === 0) return { text: 'Out of Stock', class: 'badge bg-danger' };
        if (stock <= 10) return { text: 'Low Stock', class: 'badge bg-warning' };
        return { text: 'In Stock', class: 'badge bg-success' };
    }

    function renderProducts(products = null) {
        const productsToRender = products || getProducts();
        filteredProducts = productsToRender;
        productList.empty();
        
        productsToRender.forEach((product, index) => {
            const stockStatus = getStockStatus(product.stock);
            productList.append(`
                <tr>
                    <td>
                        <img src="${product.image}" alt="${product.name}" 
                             style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"
                             onerror="this.src='images/placeholder.jpg'">
                    </td>
                    <td>
                        <strong>${product.name}</strong>
                        <br><small class="text-muted">${product.description.substring(0, 50)}...</small>
                    </td>
                    <td>
                        <span class="badge bg-info">${product.category}</span>
                    </td>
                    <td>$${product.price_sgd.toFixed(2)}</td>
                    <td>
                        <input type="number" class="form-control form-control-sm stock-input" 
                               value="${product.stock}" min="0" data-product-id="${product.id}" 
                               style="width: 80px;">
                    </td>
                    <td>
                        <span class="${stockStatus.class}">${stockStatus.text}</span>
                    </td>
                    <td>
                        <div class="btn-group" role="group">
                            <button class="btn btn-sm btn-primary edit-product" data-product-id="${product.id}" title="Edit Product">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger delete-product" data-product-id="${product.id}" title="Delete Product">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `);
        });
        
        updateStats();
    }

    function getProducts() {
        // First try to get from localStorage, then fall back to window.products
        let products = JSON.parse(localStorage.getItem('products'));
        if (!products && window.products) {
            products = window.products;
            localStorage.setItem('products', JSON.stringify(products));
        }
        return products || [];
    }

    function saveProducts(products) {
        // Save to localStorage and update the global products variable
        localStorage.setItem('products', JSON.stringify(products));
        window.products = products;
    }

    function applyFilters() {
        const searchTerm = $('#product-search').val().toLowerCase();
        const categoryFilter = $('#category-filter').val();
        const stockFilter = $('#stock-filter').val();
        
        let filtered = getProducts();
        
        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply category filter
        if (categoryFilter) {
            filtered = filtered.filter(product => product.category === categoryFilter);
        }
        
        // Apply stock filter
        if (stockFilter) {
            switch (stockFilter) {
                case 'in-stock':
                    filtered = filtered.filter(product => product.stock > 10);
                    break;
                case 'low-stock':
                    filtered = filtered.filter(product => product.stock > 0 && product.stock <= 10);
                    break;
                case 'out-of-stock':
                    filtered = filtered.filter(product => product.stock === 0);
                    break;
            }
        }
        
        renderProducts(filtered);
    }

    // Search and filter handlers (remove existing handlers first)
    $('#product-search').off('input').on('input', applyFilters);
    $('#category-filter').off('change').on('change', applyFilters);
    $('#stock-filter').off('change').on('change', applyFilters);

    // Stock update handler (remove existing handlers first)
    productList.off('change', '.stock-input').on('change', '.stock-input', function() {
        const productId = parseInt($(this).data('product-id'));
        const newStock = parseInt($(this).val()) || 0;
        
        let products = getProducts();
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex !== -1) {
            products[productIndex].stock = newStock;
            saveProducts(products);
            renderProducts(filteredProducts.length > 0 ? filteredProducts : products);
            showSuccessAlert('Stock updated successfully!');
        }
    });

    // Add product form handler (remove existing handlers first to prevent duplicates)
    $('#add-product-form').off('submit').on('submit', function(e) {
        e.preventDefault();
        
        const products = getProducts();
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        
        // Get image path from either file upload or manual input
        const imagePathFromFile = $('#add-product-image-path').val();
        const imagePath = imagePathFromFile || 'images/placeholder.jpg';
        
        const newProduct = {
            id: newId,
            name: $('#add-product-name').val(),
            category: $('#add-product-category').val(),
            price: parseFloat($('#add-product-price').val()),
            price_sgd: parseFloat($('#add-product-price').val()),
            stock: parseInt($('#add-product-stock').val()),
            description: $('#add-product-description').val(),
            image_url: imagePath,
            image: imagePath, // For compatibility
            features: $('#add-product-features').val().split('\n').filter(f => f.trim()),
            colors: ['Default'], // Add default color
            family: 'Standard', // Add default family
            in_stock: true,
            IsActive: true
        };
        
        products.push(newProduct);
        saveProducts(products);
        renderProducts();
        
        // Process image upload if there's a pending file
        if (window.pendingImageFile) {
            processImageUpload(window.pendingImageFile);
            window.pendingImageFile = null;
        }
        
        $('#addProductModal').modal('hide');
        $('#add-product-form')[0].reset();
        resetImageUpload('add');
        showSuccessAlert('Product added successfully!');
    });

    // Edit product handler (remove existing handlers first)
    productList.off('click', '.edit-product').on('click', '.edit-product', function() {
        const productId = parseInt($(this).data('product-id'));
        const products = getProducts();
        const product = products.find(p => p.id === productId);
        
        if (product) {
            $('#edit-product-id').val(product.id);
            $('#edit-product-name').val(product.name);
            $('#edit-product-category').val(product.category);
            $('#edit-product-price').val(product.price_sgd || product.price);
            $('#edit-product-stock').val(product.stock);
            $('#edit-product-description').val(product.description);
            $('#edit-product-image-path').val(product.image || product.image_url);
            $('#edit-product-features').val(product.features ? product.features.join('\n') : '');
            
            // Show current image preview if exists
            const currentImagePath = product.image || product.image_url;
            if (currentImagePath && currentImagePath !== 'images/placeholder.jpg') {
                $('#edit-image-preview').html(`
                    <img src="${currentImagePath}" alt="Current image" 
                         style="max-width: 100%; max-height: 90px; object-fit: cover; border-radius: 4px;"
                         onerror="this.parentElement.innerHTML='<i class=\\"fas fa-image fa-2x text-muted\\"></i>';">
                `);
            } else {
                $('#edit-image-preview').html('<i class="fas fa-image fa-2x text-muted"></i>');
            }
            
            // Reset any pending image upload
            resetImageUpload('edit');
            
            $('#editProductModal').modal('show');
        }
    });

    // Update product form handler
    // Edit product form handler (remove existing handlers first)
    $('#edit-product-form').off('submit').on('submit', function(e) {
        e.preventDefault();
        
        const productId = parseInt($('#edit-product-id').val());
        let products = getProducts();
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex !== -1) {
            // Get image path from either new upload or existing path
            const imagePathFromFile = $('#edit-product-image-path').val();
            const imagePath = imagePathFromFile || products[productIndex].image || products[productIndex].image_url;
            
            products[productIndex] = {
                ...products[productIndex],
                name: $('#edit-product-name').val(),
                category: $('#edit-product-category').val(),
                price: parseFloat($('#edit-product-price').val()),
                price_sgd: parseFloat($('#edit-product-price').val()),
                stock: parseInt($('#edit-product-stock').val()),
                description: $('#edit-product-description').val(),
                image_url: imagePath,
                image: imagePath, // For compatibility
                features: $('#edit-product-features').val().split('\n').filter(f => f.trim())
            };
            
            saveProducts(products);
            renderProducts();
            
            // Process image upload if there's a pending file
            if (window.pendingEditImageFile) {
                processImageUpload(window.pendingEditImageFile);
                window.pendingEditImageFile = null;
            }
            
            $('#editProductModal').modal('hide');
            resetImageUpload('edit');
            showSuccessAlert('Product updated successfully!');
        }
    });

    // Delete product handler
    // Delete product handler (remove existing handlers first)
    productList.off('click', '.delete-product').on('click', '.delete-product', function() {
        const productId = parseInt($(this).data('product-id'));
        const products = getProducts();
        const product = products.find(p => p.id === productId);
        
        if (product && confirm(`Are you sure you want to delete "${product.name}"?`)) {
            const updatedProducts = products.filter(p => p.id !== productId);
            saveProducts(updatedProducts);
            renderProducts();
            showSuccessAlert('Product deleted successfully!');
        }
    });

    // Initialize the page
    initializeProducts();
    renderProducts();
    
    // Reset image uploads when modals are closed (remove existing handlers first)
    $('#addProductModal').off('hidden.bs.modal').on('hidden.bs.modal', function() {
        resetImageUpload('add');
    });
    
    $('#editProductModal').off('hidden.bs.modal').on('hidden.bs.modal', function() {
        resetImageUpload('edit');
    });
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('loggedInUser'));
}

// Image upload handling functions
function handleImageUpload(input, mode) {
    const file = input.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPG, PNG, GIF, or WebP)');
        input.value = '';
        return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        alert('Image file size must be less than 5MB');
        input.value = '';
        return;
    }

    // Create file reader to preview image
    const reader = new FileReader();
    reader.onload = function(e) {
        const previewId = mode === 'add' ? 'add-image-preview' : 'edit-image-preview';
        const pathInputId = mode === 'add' ? 'add-product-image-path' : 'edit-product-image-path';
        
        // Show image preview
        $(`#${previewId}`).html(`
            <img src="${e.target.result}" alt="Preview" 
                 style="max-width: 100%; max-height: 90px; object-fit: cover; border-radius: 4px;">
        `);

        // Generate image path based on filename
        const sanitizedName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, '-');
        const imagePath = `images/${sanitizedName}`;
        $(`#${pathInputId}`).val(imagePath);

        // Store the file data for later processing
        if (mode === 'add') {
            window.pendingImageFile = {
                file: file,
                path: imagePath,
                dataUrl: e.target.result
            };
        } else {
            window.pendingEditImageFile = {
                file: file,
                path: imagePath,
                dataUrl: e.target.result
            };
        }

        showImageUploadInfo(mode, file.name, imagePath);
    };

    reader.readAsDataURL(file);
}

function showImageUploadInfo(mode, fileName, imagePath) {
    const modalSelector = mode === 'add' ? '#addProductModal' : '#editProductModal';
    
    // Remove any existing info alert
    $(`${modalSelector} .image-upload-info`).remove();
    
    // Add info about the uploaded file
    const infoHtml = `
        <div class="alert alert-info image-upload-info mt-2">
            <i class="fas fa-info-circle me-2"></i>
            <strong>Image ready for upload:</strong><br>
            <small>File: ${fileName}<br>
            Will be saved as: ${imagePath}<br>
            <em>Note: The image will be copied to the images folder when you save the product.</em></small>
        </div>
    `;
    
    const targetContainer = mode === 'add' ? 
        $(`${modalSelector} #add-product-image-path`).parent() : 
        $(`${modalSelector} #edit-product-image-path`).parent();
    
    targetContainer.append(infoHtml);
}

function processImageUpload(imageData) {
    // In a real application, you would upload the file to a server
    // For this demo, we'll simulate the process and provide instructions
    
    if (imageData && imageData.file) {
        console.log('Image file ready for upload:', imageData);
        
        // Show instructions to user about manually copying the file
        const instructions = `
            <div class="alert alert-warning mt-3">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <strong>Manual Step Required:</strong><br>
                Please copy the selected image file to: <code>WebClient/images/${imageData.file.name.toLowerCase().replace(/[^a-z0-9.]/g, '-')}</code><br>
                <small>The product has been saved with the image path. Copy your image file to the images folder to complete the setup.</small>
            </div>
        `;
        
        // Add instructions to the page
        $('.container').prepend(instructions);
        
        // Auto-remove the instructions after 10 seconds
        setTimeout(() => {
            $('.alert-warning').fadeOut();
        }, 10000);
    }
}

function resetImageUpload(mode) {
    const previewId = mode === 'add' ? 'add-image-preview' : 'edit-image-preview';
    const fileInputId = mode === 'add' ? 'add-product-image-file' : 'edit-product-image-file';
    const pathInputId = mode === 'add' ? 'add-product-image-path' : 'edit-product-image-path';
    
    // Reset preview
    $(`#${previewId}`).html('<i class="fas fa-image fa-2x text-muted"></i>');
    
    // Clear file input
    $(`#${fileInputId}`).val('');
    
    // Clear or reset path input
    if (mode === 'add') {
        $(`#${pathInputId}`).val('');
        window.pendingImageFile = null;
    } else {
        // For edit mode, keep the original path
        window.pendingEditImageFile = null;
    }
    
    // Remove info alerts
    $('.image-upload-info').remove();
}
