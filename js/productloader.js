let allProducts = [];

// Initialize products from JSON
async function loadProducts() {
    try {
        const response = await fetch('./assets/products.json');
        if (!response.ok) throw new Error("Fetch failed");
        allProducts = await response.json();
        applyFiltersAndSort();
    } catch (error) {
        console.error("Initialization error:", error);
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

// Core Rendering function
function renderProducts(products) {
    const container = document.getElementById('productGrid');
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: gray;">No gadgets found in this range.</p>`;
        return;
    }

    container.innerHTML = products.map(product => `
        <article class="card">
            <div class="card-img"><img src="${product.image}" alt="${product.name}"></div>
            <div class="card-body">
                <h4 class="card-title">${product.name}</h4>
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
    
    lucide.createIcons();
}

// Global Filter & Sort Logic
function applyFiltersAndSort() {
    const minPrice = parseInt(document.getElementById("minPrice")?.value || 0);
    const maxPrice = parseInt(document.getElementById("maxPrice")?.value || 3000);
    const sortValue = document.getElementById("sortSelect")?.value || "name";

    // 1. Filter by price
    let results = allProducts.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // 2. Filter by Rating
    const checkedRatings = Array.from(document.querySelectorAll('.rating-checkbox:checked'))
                                .map(cb => parseInt(cb.value));
    
    if (checkedRatings.length > 0) {
        const minSelected = Math.min(...checkedRatings);
        results = results.filter(p => p.rating >= minSelected);
    }

    // 3. Sorting
    if (sortValue === "low") {
        results.sort((a, b) => a.price - b.price);
    } else if (sortValue === "high") {
        results.sort((a, b) => b.price - a.price);
    } else {
        results.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderProducts(results);

    // Update count display
    const countElem = document.querySelector('.products-count');
    if (countElem) countElem.textContent = `${results.length} products`;
}

// Setup Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("sortSelect")?.addEventListener("change", applyFiltersAndSort);

    document.querySelectorAll(".rating-checkbox").forEach(cb => {
        cb.addEventListener("change", applyFiltersAndSort);
    });

    document.querySelector(".btn-clear")?.addEventListener("click", () => {
        document.getElementById("minPrice").value = 0;
        document.getElementById("maxPrice").value = 3000;
        document.querySelectorAll('.rating-checkbox').forEach(cb => cb.checked = false);
        
        if (window.updateSliderUI) window.updateSliderUI();
        applyFiltersAndSort(); 
    });
});

loadProducts();