let allProducts = [];
let promoProducts = [];

async function initDeals() {
    try {
        const response = await fetch('./assets/products.json');
        if (!response.ok) throw new Error("Fetch failed");
        allProducts = await response.json();

        promoProducts = allProducts.filter(item => item.discount);
        
        renderPromoGrid(promoProducts);
    } catch (error) {
        console.error("Error loading deals:", error);
    }
}

// Generate stars using Lucide icons
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

function renderPromoGrid(products) {
    const container = document.getElementById('dealsGrid');
    if (!container) return;

    container.innerHTML = products.map(product => `
        <article class="card" onclick="window.location.href='product.html?id=${product.id}'">
            <div class="card-img">
                <span class="badge-discount">Save ${product.discount}%</span>
                <img src="${product.images[0]}" alt="${product.name}">
            </div>
            <div class="card-body">
                <h3 class="card-title">${product.name}</h3>
                <div class="rating">
                    ${renderStars(product.rating)}
                    <span class="rating-val">(${product.rating})</span>
                </div>
                <div class="card-footer">
                    <span class="price">$${product.price}</span>
                    <span class="category">${product.category}</span>
                </div>
            </div>
        </article>
    `).join('');

    if (window.lucide) {
        lucide.createIcons();
    }
}

document.addEventListener('DOMContentLoaded', initDeals);