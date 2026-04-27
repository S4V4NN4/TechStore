function handleAddToCart(btn) {
    let productId = btn ? parseInt(btn.dataset.id) : null;

    if (!productId) {
        const urlParams = new URLSearchParams(window.location.search);
        productId = parseInt(urlParams.get('id'));
    }

    if (!productId) {
        console.error("ID товара не найден");
        return;
    }

    const qtyEl = document.getElementById('qtyNumber');
    const quantity = qtyEl ? (parseInt(qtyEl.innerText) || 1) : 1;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.id === productId);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += quantity;
    } else {
        cart.push({ id: productId, quantity: quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    if (typeof updateCartBadge === 'function') updateCartBadge();
}

document.addEventListener('click', function (event) {
    const addToCartBtn = event.target.closest('.btn-add-cart');
    if (addToCartBtn) {
        handleAddToCart(addToCartBtn);
    }
});