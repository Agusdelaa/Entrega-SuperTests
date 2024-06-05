export default class ProductDTO {
    constructor(product) {
        this.title = product.title.trim();
        this.description = product.description?.trim() || 'Sin descripción';
        this.code = product.code.trim();
        this.price = product.price;
        // Si el valor de product.status es un booleano, se asigna tal cual. Si es un string, se asigna true si es 'true' y false en cualquier otro caso.
        this.status = typeof product.status === 'boolean' ? product.status : product.status === 'true' ? true : false;
        // Si el valor de product.stock es un número, se asigna tal cual. Si no es un número o es menor a 0, se asigna 0.
        this.stock = product.stock ? (isNaN(product.stock) || product.stock < 0 ? 1 : parseInt(product.stock)) : 0;
        this.category = product.category?.trim() || 'Otros';
        this.thumbnails = Array.isArray(product.thumbnails) ? product.thumbnails : (product.thumbnails ? product.thumbnails.split(',').map(thumbnail => thumbnail.trim()) : []);
        this.owner = product.owner?.trim() || 'admin';
    }
}