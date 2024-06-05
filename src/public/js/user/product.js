async function addProductToCart(productId, cartId) {
    try {
        const quantity = parseInt(document.querySelector('#quantity').value);
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity })
        });
        const data = await response.json();
        if (data.status === 'success') {
            alert('Producto agregado al carrito exitosamente');
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert(error);
    }
}