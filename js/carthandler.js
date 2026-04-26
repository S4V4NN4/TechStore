/**
 * Скрипт для управления корзиной (LocalStorage)
 */

document.addEventListener('click', function (event) {
    // Проверяем, был ли клик совершен по кнопке "Add to Cart" 
    // или по иконке внутри этой кнопки
    const addToCartBtn = event.target.closest('.btn-add-cart');

    if (addToCartBtn) {
        handleAddToCart();
    }
});

function handleAddToCart() {
    // 1. Получаем ID продукта из URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    // 2. Получаем количество из элемента на странице
    const qtyEl = document.getElementById('qtyNumber');
    const quantity = parseInt(qtyEl.innerText) || 1;

    if (!productId) {
        console.error("Product ID not found in URL");
        return;
    }

    // 3. Достаем текущую корзину из LocalStorage (если её нет - создаем пустой массив)
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // 4. Проверяем, есть ли уже такой товар в корзине
    const existingProductIndex = cart.findIndex(item => item.id === productId);

    if (existingProductIndex > -1) {
        // Если есть — просто прибавляем количество
        cart[existingProductIndex].quantity += quantity;
    } else {
        // Если нет — добавляем новый объект
        cart.push({
            id: productId,
            quantity: quantity
        });
    }

    // 5. Сохраняем обновленную корзину обратно в LocalStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Простая функция уведомления
function showNotification(message) {
    // Можно заменить на красивый toast или alert
    alert(message);
    
    // Если нужно обновить иконку корзины в шапке сразу, 
    // можно вызвать функцию обновления счетчика здесь
    if (typeof updateCartCounter === 'function') {
        updateCartCounter();
    }
}