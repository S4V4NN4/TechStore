document.addEventListener('click', function (event) {
    const addToCartBtn = event.target.closest('.btn-add-cart');

    if (addToCartBtn) {
        handleAddToCart();
    }
});

function handleAddToCart() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    const qtyEl = document.getElementById('qtyNumber');
    const quantity = parseInt(qtyEl.innerText) || 1;

    if (!productId) {
        console.error("Product ID not found in URL");
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingProductIndex = cart.findIndex(item => item.id === productId);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += quantity;
    } else {
        cart.push({
            id: productId,
            quantity: quantity
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}