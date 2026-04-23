document.addEventListener('DOMContentLoaded', () => {
    // Lucide Icons initialization
    if (window.lucide) {
        lucide.createIcons();
    }

    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');
    const filterOpenBtn = document.getElementById('filterOpenBtn');
    const filterCloseBtn = document.getElementById('filterCloseBtn');
    const sidebarFilters = document.getElementById('sidebarFilters');

    // Burger Menu Toggle
    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
        });
    }

    // Filters Mobile Toggle (Open)
    if (filterOpenBtn && sidebarFilters) {
        filterOpenBtn.addEventListener('click', () => {
            sidebarFilters.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });
    }

    // Filters Mobile Toggle (Close)
    if (filterCloseBtn && sidebarFilters) {
        filterCloseBtn.addEventListener('click', () => {
            sidebarFilters.classList.remove('active');
            document.body.style.overflow = ''; 
        });
    }

    // Close components on outside click
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