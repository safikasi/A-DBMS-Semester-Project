// Admin module for the inventory system

// Load and display dashboard data
function loadDashboardData() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Update product count
    document.getElementById('product-count').textContent = products.length;
    
    // Update user count
    document.getElementById('user-count').textContent = users.length;
    
    // Update low stock count (products with stock < 10)
    const lowStockCount = products.filter(p => p.stock < 10).length;
    document.getElementById('lowstock-count').textContent = lowStockCount;
    
    // Calculate total inventory value
    const totalValue = products.reduce((sum, product) => {
        return sum + (product.price * product.stock);
    }, 0);
    document.getElementById('total-value').textContent = '$' + totalValue.toFixed(2);
}

// Load and display product data in table
function loadProductsTable() {
    const productsTableBody = document.getElementById('products-table-body');
    if (!productsTableBody) return;
    
    // Clear table
    productsTableBody.innerHTML = '';
    
    // Get products and users
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Sort products by ID
    products.sort((a, b) => a.id - b.id);
    
    // Render each product
    products.forEach(product => {
        const seller = users.find(user => user.id === product.sellerId) || { username: 'Unknown' };
        
        const stockClass = product.stock < 10 ? 'text-danger' : 
                           product.stock < 50 ? 'text-warning' : 'text-success';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td><span class="badge bg-secondary">${product.category}</span></td>
            <td>$${product.price.toFixed(2)}</td>
            <td class="${stockClass}">${product.stock}</td>
            <td>${seller.username}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1 edit-product" data-id="${product.id}">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger delete-product" data-id="${product.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        productsTableBody.appendChild(row);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            editProduct(productId);
        });
    });
    
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            confirmDeleteProduct(productId);
        });
    });
}

// Load and display user data in table
function loadUsersTable() {
    const usersTableBody = document.getElementById('users-table-body');
    if (!usersTableBody) return;
    
    // Clear table
    usersTableBody.innerHTML = '';
    
    // Get users and products
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Sort users by ID
    users.sort((a, b) => a.id - b.id);
    
    // Render each user
    users.forEach(user => {
        const userProducts = products.filter(p => p.sellerId === user.id);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td><span class="badge ${user.isAdmin ? 'bg-danger' : 'bg-success'}">${user.isAdmin ? 'Admin' : 'Seller'}</span></td>
            <td>${userProducts.length}</td>
        `;
        
        usersTableBody.appendChild(row);
    });
}

// Setup the add/edit product form for admin
function editProduct(productId = null) {
    const modalTitle = document.getElementById('productModalTitle');
    const productForm = document.getElementById('product-form');
    const productIdInput = document.getElementById('product-id');
    const nameInput = document.getElementById('product-name');
    const categoryInput = document.getElementById('product-category');
    const priceInput = document.getElementById('product-price');
    const stockInput = document.getElementById('product-stock');
    const sellerInput = document.getElementById('product-seller');
    
    // Clear form
    productForm.reset();
    
    // Load sellers to dropdown
    const users = JSON.parse(localStorage.getItem('users')) || [];
    sellerInput.innerHTML = '<option value="">Select a seller</option>';
    
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.username;
        sellerInput.appendChild(option);
    });
    
    if (productId) {
        // Edit existing product
        modalTitle.textContent = 'Edit Product';
        
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products.find(p => p.id === productId);
        
        if (product) {
            productIdInput.value = product.id;
            nameInput.value = product.name;
            categoryInput.value = product.category;
            priceInput.value = product.price;
            stockInput.value = product.stock;
            sellerInput.value = product.sellerId;
        }
    } else {
        // Add new product
        modalTitle.textContent = 'Add New Product';
        productIdInput.value = '';
    }
    
    // Show modal
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    productModal.show();
}

// Save product data (admin version)
function saveProduct() {
    const productId = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const category = document.getElementById('product-category').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const stock = parseInt(document.getElementById('product-stock').value);
    const sellerId = parseInt(document.getElementById('product-seller').value);
    
    // Validate inputs
    if (!name || !category || isNaN(price) || isNaN(stock) || isNaN(sellerId)) {
        alert('Please fill all fields with valid values');
        return;
    }
    
    // Get products from storage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    if (productId) {
        // Update existing product
        const index = products.findIndex(p => p.id === parseInt(productId));
        
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                category,
                price,
                stock,
                sellerId
            };
        }
    } else {
        // Add new product
        const newProduct = {
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            name,
            category,
            price,
            stock,
            sellerId
        };
        
        products.push(newProduct);
    }
    
    // Save to storage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Hide modal
    const productModal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    productModal.hide();
    
    // Reload data
    loadProductsTable();
    loadDashboardData();
}

// Confirm product deletion
function confirmDeleteProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Set product name in confirmation dialog
    document.getElementById('delete-product-name').textContent = product.name;
    
    // Set up delete button
    const confirmBtn = document.getElementById('confirm-delete-btn');
    confirmBtn.onclick = () => deleteProduct(productId);
    
    // Show modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Delete product
function deleteProduct(productId) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Remove product
    products = products.filter(p => p.id !== productId);
    
    // Save to storage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Hide modal
    const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
    deleteModal.hide();
    
    // Reload data
    loadProductsTable();
    loadDashboardData();
}

// Check if user is admin, redirect if not
function checkAdminStatus() {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = 'index.html';
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    checkAdminStatus();
    loadDashboardData();
    loadProductsTable();
    loadUsersTable();
    
    // Add save button handler
    const saveBtn = document.getElementById('save-product-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveProduct);
    }
    
    // Add product button handler in table header
    const addBtns = document.querySelectorAll('button[data-bs-target="#productModal"]');
    addBtns.forEach(btn => {
        btn.addEventListener('click', () => editProduct());
    });
});