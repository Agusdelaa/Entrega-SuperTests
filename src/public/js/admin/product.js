async function deleteProduct(id) {
    try {
        const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.status === 'error') {
            alert(data.message);
        } else {
            alert('Producto eliminado exitosamente');
            window.location.href = '/admin/products';
        }
    } catch (error) {
        alert(error);
    }
}