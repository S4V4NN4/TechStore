async function initCategories() {
    try {
        const response = await fetch('./assets/products.json');
        if (!response.ok) throw new Error("Fetch failed");
        
        const products = await response.json();
        
        // Calculate counts based on the loaded JSON data
        const categoryCounts = calculateCategoryCounts(products);

        // Update the HTML cards with the actual product numbers
        updateCategoryCards(categoryCounts);

    } catch (error) {
        console.error("Initialization error:", error);
    }
}

function calculateCategoryCounts(products) {
    return products.reduce((acc, product) => {
        const cat = product.category;
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});
}

function updateCategoryCards(counts) {
    const cards = document.querySelectorAll('.cat-card');

    cards.forEach(card => {
        // We identify the category by reading the text inside the <h3> tag
        const titleElem = card.querySelector('h3');
        if (!titleElem) return;

        const categoryName = titleElem.textContent.trim();
        const countElem = card.querySelector('.cat-count');
        
        if (countElem) {
            const count = counts[categoryName] || 0;
            
            // Pluralization logic for better UX
            const label = count === 1 ? 'Product' : 'Products';
            countElem.textContent = `${count} ${label}`;
        }
    });

    // Re-initialize icons in case any were added dynamically
    if (window.lucide) {
        lucide.createIcons();
    }
}

document.addEventListener('DOMContentLoaded', initCategories);