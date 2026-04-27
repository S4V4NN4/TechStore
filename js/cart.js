let allProducts = [];

let isPromoApplied = false;
const PROMO_CODE = "SAVE10";
const DISCOUNT_PERCENT = 0.10;

const cartPageContainer = document.querySelector('.cart-container');
const cartItemsContainer = document.getElementById('cartItemsList');
const heroSection = document.querySelector('.hero');

const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('totalPrice');

async function initCart() {
    try {
        const response = await fetch('./assets/products.json');
        if (!response.ok) throw new Error("Error loading products.");
        
        allProducts = await response.json();
        
        renderCart();
        initPromoHandler();
    } catch (error) {
        console.error("Ошибка инициализации:", error);
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = `<p>Error loading products.</p>`;
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

    updateCartBadge();
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
    updateCartBadge();
}

function updateSummary(subtotal) {
    const taxRate = 0.08;
    let discount = 0;
    
    const existingDiscountRow = document.getElementById('discount-row');
    if (existingDiscountRow) existingDiscountRow.remove();

    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    if (isPromoApplied) {
        discount = total * DISCOUNT_PERCENT;
        
        const discountRow = document.createElement('div');
        discountRow.className = 'summary-row';
        discountRow.id = 'discount-row';
        discountRow.style.color = '#10b981';
        discountRow.innerHTML = `
            <span class="label">Discount (SAVE10)</span>
            <span class="value">-$${discount.toFixed(2)}</span>
        `;
        taxEl.closest('.summary-row').before(discountRow);
    }

    total = total - discount;

    if (subtotalEl) subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.innerText = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;
}

function initPromoHandler() {
    const promoInput = document.querySelector('.promo-input');
    const applyBtn = document.querySelector('.btn-apply');
    const promoHint = document.querySelector('.promo-hint');
    const promoGroup = document.querySelector('.promo-group');

    if (!applyBtn || !promoInput) return;

    applyBtn.addEventListener('click', () => {
        const value = promoInput.value.trim().toUpperCase();

        if (value === PROMO_CODE) {
            isPromoApplied = true;
            
            promoHint.style.display = 'none';
            
            let successMsg = document.querySelector('.promo-success-msg');
            if (!successMsg) {
                successMsg = document.createElement('p');
                successMsg.className = 'promo-success-msg';
                successMsg.style.color = '#10b981';
                successMsg.style.fontSize = '0.875rem';
                successMsg.style.marginTop = '8px';
                successMsg.innerText = 'Promo code applied successfully!';
                promoGroup.appendChild(successMsg);
            }

            applyBtn.disabled = true;
            applyBtn.style.opacity = '0.6';
            promoInput.readOnly = true;

            renderCart(); 
        } else {
            alert('Invalid promo code. Try SAVE10');
        }
    });
}

initCart();
