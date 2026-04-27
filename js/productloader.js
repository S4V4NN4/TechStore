let allProducts = [];

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

function renderProducts(products) {
    const container = document.getElementById('productGrid');
    if (!container) return;

    container.innerHTML = products.map(product => `
        <article class="card" onclick="window.location.href='product.html?id=${product.id}'">
            <div class="card-img">
                <img src="${product.images[0]}" alt="${product.name}">
            </div>
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

function applyFiltersAndSort() {
    const minPrice = parseInt(document.getElementById("minPrice")?.value || 0);
    const maxPrice = parseInt(document.getElementById("maxPrice")?.value || 3000);
    const sortValue = document.getElementById("sortSelect")?.value || "name";

    let results = allProducts.filter(p => p.price >= minPrice && p.price <= maxPrice);

    const checkedRatings = Array.from(document.querySelectorAll('.rating-checkbox:checked'))
                                .map(cb => parseInt(cb.value));
    
    if (checkedRatings.length > 0) {
        const minSelected = Math.min(...checkedRatings);
        results = results.filter(p => p.rating >= minSelected);
    }

    if (sortValue === "low") {
        results.sort((a, b) => a.price - b.price);
    } else if (sortValue === "high") {
        results.sort((a, b) => b.price - a.price);
    } else {
        results.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderProducts(results);

    const countElem = document.querySelector('.products-count');
    if (countElem) countElem.textContent = `${results.length} products`;
}

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