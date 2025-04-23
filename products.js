// Products module for the inventory system

// Get current user
const currentUser = JSON.parse(localStorage.getItem('user'));

// Initialize product data in local storage if not present
function initializeProducts() {
    if (!localStorage.getItem('products')) {
        const sampleProducts = [
            {
                id: 1,
                name: "Smartphone X",
                category: "electronics",
                price: 699.99,
                stock: 25,
                sellerId: 1
            },
            {
                id: 2,
                name: "Laptop Pro",
                category: "electronics",
                price: 1299.99,
                stock: 10,
                sellerId: 1
            },
            {
                id: 3,
                name: "Designer T-Shirt",
                category: "clothing",
                price: 29.99,
                stock: 50,
                sellerId: 2
            },
            {
                id: 4,
                name: "Coffee Table",
                category: "home",
                price: 149.99,
                stock: 15,
                sellerId: 2
            },
            {
                id: 5,
                name: "Bestseller Novel",
                category: "books",
                price: 19.99,
                stock: 100,
                sellerId: 1
            }
        ];
        
        localStorage.setItem('products', JSON.stringify(sampleProducts));
    }
}

// Load and display all products
function loadProducts(filters = {}) {
    const productsContainer = document.getElementById('products-container');
    const loadingElement = document.getElementById('loading');
    const noProductsElement = document.getElementById('no-products');
    
    if (!productsContainer) return;
    
    // Show loading indicator
    loadingElement.style.display = 'block';
    noProductsElement.style.display = 'none';
    
    // Get products from local storage
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Apply filters
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        products = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filters.category && filters.category !== 'all') {
        products = products.filter(product => 
            product.category === filters.category
        );
    }
    
    if (filters.minPrice) {
        products = products.filter(product => 
            product.price >= parseFloat(filters.minPrice)
        );
    }
    
    if (filters.maxPrice) {
        products = products.filter(product => 
            product.price <= parseFloat(filters.maxPrice)
        );
    }
    
    // Get users to display seller names
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
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
            const seller = users.find(user => user.id === product.sellerId) || { username: 'Unknown' };
            
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
                        <p class="card-text text-muted">
                            <small>Seller: ${seller.username}</small>
                        </p>
                    </div>
                    <div class="card-footer bg-transparent d-flex justify-content-between">
                        <button class="btn btn-primary view-details" data-id="${product.id}">
                            View Details
                        </button>
                        <div>
                            ${
                                currentUser && (currentUser.isAdmin || currentUser.id === product.sellerId) ?
                                `
                                <button class="btn btn-outline-primary btn-action edit-product" data-id="${product.id}">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-outline-danger btn-action delete-product" data-id="${product.id}">
                                    <i class="bi bi-trash"></i>
                                </button>
                                ` : ''
                            }
                        </div>
                    </div>
                </div>
            `;
            
            productsContainer.appendChild(col);
        });
        
        // Add event listeners to buttons
        setupProductButtonListeners();
    }, 500);
}

// Add event listeners to product buttons
function setupProductButtonListeners() {
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

// Show product details in modal
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

// Setup the add/edit product form
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

// Save product data
function saveProduct() {
    const productId = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const category = document.getElementById('product-category').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const stock = parseInt(document.getElementById('product-stock').value);
    
    // Validate inputs
    if (!name || !category || isNaN(price) || isNaN(stock)) {
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
                stock
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
            sellerId: currentUser.id
        };
        
        products.push(newProduct);
    }
    
    // Save to storage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Hide modal
    const productModal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    productModal.hide();
    
    // Reload products
    loadProducts();
    
    // If on my-products page, reload those too
    if (window.location.pathname.includes('my-products.html')) {
        loadMyProducts();
    }
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
    
    // Reload products
    loadProducts();
    
    // If on my-products page, reload those too
    if (window.location.pathname.includes('my-products.html')) {
        loadMyProducts();
    }
}

// Setup filter functionality
function setupFilters() {
    const filterBtn = document.getElementById('filter-btn');
    if (!filterBtn) return;
    
    filterBtn.addEventListener('click', () => {
        const searchInput = document.getElementById('search-input').value;
        const categoryFilter = document.getElementById('category-filter').value;
        const minPrice = document.getElementById('min-price').value;
        const maxPrice = document.getElementById('max-price').value;
        
        loadProducts({
            search: searchInput,
            category: categoryFilter,
            minPrice,
            maxPrice
        });
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initializeProducts();
    loadProducts();
    setupFilters();
    
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