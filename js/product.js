let allProducts = [];

async function initProductPage() {
    try {
        const response = await fetch('./assets/products.json');
        if (!response.ok) throw new Error("JSON load failed");
        allProducts = await response.json();

        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        const product = allProducts.find(p => p.id === productId);

        if (product) {
            renderProduct(product);
            renderRelated(product.related);
        } else {
            document.getElementById('productPageContent').innerHTML = "<h1>Product not found</h1>";
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function renderStars(rating) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            starsHtml += `<i data-lucide="star" class="fill-current"></i>`;
        } else if (i - rating < 1 && i - rating > 0) {
            starsHtml += `<i data-lucide="star-half" class="fill-current"></i>`;
        } else {
            starsHtml += `<i data-lucide="star" class="empty"></i>`;
        }
    }
    return `<div class="stars">${starsHtml}</div>`;
}

function renderProduct(product) {
    const container = document.getElementById('productPageContent');
    
    container.innerHTML = `
        <nav class="breadcrumbs">
            <a href="index.html">Products</a>
            <i data-lucide="chevron-right"></i>
            <span>${product.category}</span>
            <i data-lucide="chevron-right"></i>
            <span class="current">${product.name}</span>
        </nav>

        <div class="product-layout">
            <!-- Левая колонка: Увеличенная галерея -->
            <div class="product-gallery">
                <div class="main-image">
                    <img src="${product.images[0]}" id="mainDisplayImg" alt="${product.name}">
                </div>
                <div class="thumbs-container">
                    ${product.images.map((img, i) => `
                        <div class="thumb ${i === 0 ? 'active' : ''}" onclick="switchImage(this, '${img}')">
                            <img src="${img}" alt="thumbnail">
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Правая колонка: Инфо -->
            <div class="product-details">
                <h1 class="product-title">${product.name}</h1>
                
                <div class="rating-vertical">
                    ${renderStars(product.rating)}
                    <span class="review-count">Based on ${product.review_count} reviews</span>
                </div>

                <div class="product-price-row">
                    <span class="price-val">$${product.price}</span>
                    <span class="shipping-tag">Free shipping</span>
                </div>

                <div class="highlights-box">
                    <h4>Key Highlights</h4>
                    <ul>
                        ${product.highlights.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>

                <div class="product-description">
                    <h4>Description</h4>
                    <p>${product.description}</p>
                </div>

                <div class="purchase-container">
                    <div class="qty-picker-row">
                        <label>Quantity</label>
                        <div class="qty-picker">
                            <button onclick="updateQty(-1)">-</button>
                            <span id="qtyNumber">1</span>
                            <button onclick="updateQty(1)">+</button>
                        </div>
                    </div>
                    <button class="btn-add-cart">
                        <i data-lucide="shopping-cart"></i> Add to Cart
                    </button>
                </div>

                <div class="specs-accordion" id="specsAccordion">
                    <div class="specs-header" onclick="toggleAccordion()">
                        <span>Technical Specifications</span>
                        <i data-lucide="chevron-down" id="accordionIcon"></i>
                    </div>
                    <div class="specs-body" id="accordionBody">
                        ${Object.entries(product.technical_specs).map(([key, value]) => `
                            <div class="spec-item">
                                <span class="spec-label">${key}</span>
                                <span class="spec-value">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    lucide.createIcons();
}

function renderRelated(relatedIds) {
    const grid = document.getElementById('relatedGrid');
    const items = allProducts.filter(p => relatedIds.includes(p.id));

    grid.innerHTML = items.map(p => `
        <article class="card" onclick="window.location.href='product.html?id=${p.id}'">
            <div class="card-img">
                <img src="${p.images[0]}" alt="${p.name}">
            </div>
            <div class="card-body">
                <h4 class="card-title">${p.name}</h4>
                <div class="card-footer">
                    <span class="price">$${p.price}</span>
                </div>
            </div>
        </article>
    `).join('');
    lucide.createIcons();
}

window.switchImage = (el, src) => {
    document.getElementById('mainDisplayImg').src = src;
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
};

window.updateQty = (delta) => {
    const qtyEl = document.getElementById('qtyNumber');
    let current = parseInt(qtyEl.innerText);
    current = Math.max(1, current + delta);
    qtyEl.innerText = current;
};

window.toggleAccordion = () => {
    const accordion = document.getElementById('specsAccordion');
    const body = document.getElementById('accordionBody');
    const icon = document.getElementById('accordionIcon');
    
    const isOpen = accordion.classList.toggle('open');
    if (isOpen) {
        body.style.maxHeight = body.scrollHeight + "px";
        icon.style.transform = 'rotate(180deg)';
    } else {
        body.style.maxHeight = "0px";
        icon.style.transform = 'rotate(0deg)';
    }
};

initProductPage();