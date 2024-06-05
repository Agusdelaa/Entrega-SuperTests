async function updateProductQuantity(productId, cartId) {
    try {
        const quantity = document.querySelector(`#quantity-${productId}`).value;
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity })
        });
        const data = await response.json();
        if (data.status === 'success') {
            alert('Cantidad del producto actualizada exitosamente');
            window.location.reload();
        }
    } catch (error) {
        alert(error);
    }
}

async function removeProductFromCart(productId, cartId) {
    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.status === 'success') {
            alert('Producto eliminado del carrito exitosamente');
            window.location.reload();
        }
    } catch (error) {
        alert(error);
    }
}

async function deleteCart(cartId) {
    try {
        const response = await fetch(`/api/carts/${cartId}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.status === 'success') {
            alert('Carrito vaciado exitosamente');
            window.location.reload();
        }
    } catch (error) {
        alert(error);
    }
}

async function purchaseCart(cartId) {
    try {
        const response = await fetch(`/api/carts/${cartId}/purchase`, { method: 'POST' });
        const data = await response.json();
        if (data.status === 'success') {
            if (data.payload.productsNotPurchased) {
                alert(`No se pudieron comprar los siguientes productos porque no hay stock suficiente:\n${data.payload.productsNotPurchased.map(product => product).join('\n')}`);
            }
            const date = new Date(data.payload.ticket.purchase_datetime).toLocaleDateString();
            const hour = new Date(data.payload.ticket.purchase_datetime).toLocaleTimeString();
            alert(`Compra realizada exitosamente\nTicket ${data.payload.ticket.code}\nFecha ${date}\nHora ${hour}\nMonto $${data.payload.ticket.amount}`);
            window.location.reload();
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert(error);
    }
}