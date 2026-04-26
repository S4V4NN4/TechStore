let allProducts = [];

const cartPageContainer = document.querySelector('.cart-container');
const cartItemsContainer = document.getElementById('cartItemsList');
const heroSection = document.querySelector('.hero');

const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('totalPrice');

async function initCart() {
    try {
        const response = await fetch('./assets/products.json');
        if (!response.ok) throw new Error("Не удалось загрузить базу данных товаров");
        
        allProducts = await response.json();
        
        renderCart();
    } catch (error) {
        console.error("Ошибка инициализации:", error);
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = `<p>Error loading products. Please check console.</p>`;
        }
    }
}

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        if (heroSection) heroSection.style.display = 'none';
        
        if (cartPageContainer) {
            cartPageContainer.style.display = 'block'; 
            cartPageContainer.innerHTML = `
                <div class="empty-cart-wrapper">
                    <h2>Your Cart is Empty</h2>
                    <p>Add some amazing products to get started!</p>
                    <a href="index.html" class="btn-continue-shopping">Continue Shopping</a>
                </div>
            `;
        }
        return;
    }

    if (heroSection) heroSection.style.display = 'block';
    if (cartPageContainer) cartPageContainer.style.display = 'grid';

    let cartHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const product = allProducts.find(p => p.id === item.id);
        
        if (product) {
            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;

            cartHTML += `
                <div class="cart-item" data-id="${product.id}">
                    <div class="cart-item-img">
                        <img src="${product.images[0]}" alt="${product.name}">
                    </div>
                    
                    <div class="cart-item-info">
                        <div class="cart-item-header">
                            <h3>${product.name}</h3>
                            <span class="category">${product.category}</span>
                        </div>
                        
                        <div class="qty-picker" style="margin-top: 1.5rem;">
                            <button type="button" class="qty-minus">-</button>
                            <span>${item.quantity}</span>
                            <button type="button" class="qty-plus">+</button>
                        </div>

                        <button class="remove-btn" title="Remove item">
                            <i data-lucide="trash-2"></i>
                        </button>

                        <div class="cart-item-price-block">
                            <span class="price">$${itemTotal.toFixed(2)}</span>
                            <span class="unit-price">$${product.price.toFixed(2)} each</span>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = cartHTML;
    }

    updateSummary(subtotal);
    
    lucide.createIcons();
    
    setupEventListeners();
}

function setupEventListeners() {
    document.querySelectorAll('.qty-plus').forEach(btn => {
        btn.onclick = (e) => {
            const id = parseInt(e.currentTarget.closest('.cart-item').dataset.id);
            updateQuantity(id, 1);
        };
    });

    document.querySelectorAll('.qty-minus').forEach(btn => {
        btn.onclick = (e) => {
            const id = parseInt(e.currentTarget.closest('.cart-item').dataset.id);
            updateQuantity(id, -1);
        };
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.onclick = (e) => {
            const id = parseInt(e.currentTarget.closest('.cart-item').dataset.id);
            removeFromCart(id);
        };
    });
}

function updateQuantity(id, delta) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += delta;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function updateSummary(subtotal) {
    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    if (subtotalEl) subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.innerText = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;
}

initCart();