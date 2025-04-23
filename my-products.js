// My products module for the inventory system

// Load and display products for the current user
function loadMyProducts() {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    const productsContainer = document.getElementById('my-products-container');
    const loadingElement = document.getElementById('my-products-loading');
    const noProductsElement = document.getElementById('no-my-products');
    
    if (!productsContainer) return;
    
    // Show loading indicator
    loadingElement.style.display = 'block';
    noProductsElement.style.display = 'none';
    
    // Get products from local storage
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Filter for current user's products only
    products = products.filter(product => product.sellerId === currentUser.id);
    
    // Clear products container (except loading indicator)
    Array.from(productsContainer.children).forEach(child => {
        if (child !== loadingElement && child !== noProductsElement) {
            child.remove();
        }
    });
    
    // Hide loading after a small delay (to simulate network request)
    setTimeout(() => {
        loadingElement.style.display = 'none';
        
        if (products.length === 0) {
            noProductsElement.style.display = 'block';
            return;
        }
        
        // Render each product
        products.forEach(product => {
            const stockClass = product.stock < 10 ? 'stock-low' : 
                              product.stock < 50 ? 'stock-medium' : 'stock-high';
                              
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            col.innerHTML = `
                <div class="card product-card">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <span class="badge bg-secondary mb-2 category-badge">${product.category}</span>
                        <p class="price">$${product.price.toFixed(2)}</p>
                        <p class="card-text ${stockClass}">
                            <small>In Stock: ${product.stock} units</small>
                        </p>
                    </div>
                    <div class="card-footer bg-transparent d-flex justify-content-between">
                        <button class="btn btn-primary view-details" data-id="${product.id}">
                            View Details
                        </button>
                        <div>
                            <button class="btn btn-outline-primary btn-action edit-product" data-id="${product.id}">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-danger btn-action delete-product" data-id="${product.id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            productsContainer.appendChild(col);
        });
        
        // Add event listeners to buttons
        setupMyProductButtonListeners();
    }, 500);
}

// Add event listeners to my product buttons
function setupMyProductButtonListeners() {
    // View details buttons
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            showProductDetails(productId);
        });
    });
    
    // Edit product buttons
    document.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            editProduct(productId);
        });
    });
    
    // Delete product buttons
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            confirmDeleteProduct(productId);
        });
    });
}

// Show product details in modal (same as in products.js)
function showProductDetails(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Get seller username
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const seller = users.find(user => user.id === product.sellerId) || { username: 'Unknown' };
    
    // Update modal content
    document.getElementById('detail-name').textContent = product.name;
    document.getElementById('detail-category').textContent = product.category;
    document.getElementById('detail-price').textContent = product.price.toFixed(2);
    document.getElementById('detail-stock').textContent = product.stock;
    document.getElementById('detail-seller').textContent = seller.username;
    
    // Show modal
    const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    detailsModal.show();
}

// Setup the add/edit product form (same as in products.js)
function editProduct(productId = null) {
    const modalTitle = document.getElementById('productModalTitle');
    const productForm = document.getElementById('product-form');
    const productIdInput = document.getElementById('product-id');
    const nameInput = document.getElementById('product-name');
    const categoryInput = document.getElementById('product-category');
    const priceInput = document.getElementById('product-price');
    const stockInput = document.getElementById('product-stock');
    
    // Clear form
    productForm.reset();
    
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

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadMyProducts();
    
    // Add save button handler
    const saveBtn = document.getElementById('save-product-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveProduct);
    }
    
    // Add product button handler
    const addBtn = document.getElementById('add-product-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => editProduct());
    }
});

// These functions are defined in products.js, but we need them here too
// In a real application, these would be in a shared module
if (typeof saveProduct !== 'function') {
    function saveProduct() {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const productId = document.getElementById('product-id').value;
        const name = document.getElementById('product-name').value;
        const category = document.getElementById('product-category').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const stock = parseInt(document.getElementById('product-stock').value);
        
        if (!name || !category || isNaN(price) || isNaN(stock)) {
            alert('Please fill all fields with valid values');
            return;
        }
        
        const products = JSON.parse(localStorage.getItem('products')) || [];
        
        if (productId) {
            const index = products.findIndex(p => p.id === parseInt(productId));
            
            if (index !== -1) {
                products[index] = {
                    ...products[index],
                    name,
                    category,
                    price,
                    stock
                };
            }
        } else {
            const newProduct = {
                id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
                name,
                category,
                price,
                stock,
                sellerId: currentUser.id
            };
            
            products.push(newProduct);
        }
        
        localStorage.setItem('products', JSON.stringify(products));
        
        const productModal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
        productModal.hide();
        
        loadMyProducts();
    }
}

if (typeof confirmDeleteProduct !== 'function') {
    function confirmDeleteProduct(productId) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products.find(p => p.id === productId);
        
        if (!product) return;
        
        document.getElementById('delete-product-name').textContent = product.name;
        
        const confirmBtn = document.getElementById('confirm-delete-btn');
        confirmBtn.onclick = () => deleteProduct(productId);
        
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        deleteModal.show();
    }
}

if (typeof deleteProduct !== 'function') {
    function deleteProduct(productId) {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        
        products = products.filter(p => p.id !== productId);
        
        localStorage.setItem('products', JSON.stringify(products));
        
        const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        deleteModal.hide();
        
        loadMyProducts();
    }
}