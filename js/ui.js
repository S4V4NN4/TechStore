document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        lucide.createIcons();
    }

    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');
    const filterOpenBtn = document.getElementById('filterOpenBtn');
    const filterCloseBtn = document.getElementById('filterCloseBtn');
    const sidebarFilters = document.getElementById('sidebarFilters');
    updateCartBadge();

    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
        });
    }

    if (filterOpenBtn && sidebarFilters) {
        filterOpenBtn.addEventListener('click', () => {
            sidebarFilters.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });
    }

    if (filterCloseBtn && sidebarFilters) {
        filterCloseBtn.addEventListener('click', () => {
            sidebarFilters.classList.remove('active');
            document.body.style.overflow = ''; 
        });
    }

    window.addEventListener('click', (e) => {
        // Close filters
        if (sidebarFilters && sidebarFilters.classList.contains('active')) {
            if (e.target === sidebarFilters) {
                sidebarFilters.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
        // Close burger nav
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && e.target !== burgerBtn) {
                navMenu.classList.remove('active');
            }
        }
    });
});


function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}