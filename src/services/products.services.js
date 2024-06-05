import ProductDTO from '../dao/dtos/product.dto.js';
import { Products } from '../dao/factory.js';

export default class ProductsServices {
    static async getProducts(queryParams) {
        try {
            let { limit, page, status, category, sort } = queryParams;
            // Si el valor de limit es mayor a 10, se asigna 10, si es menor a 1, se asigna 1, si no es un número, se asigna 10
            limit = limit ? (parseInt(limit) > 10 || parseInt(limit) < 1 || isNaN(parseInt(limit)) ? 10 : parseInt(limit)) : 10;
            // Si el valor de page es menor a 1 o no es un número, se asigna 1
            page = page ? (parseInt(page) < 1 || isNaN(parseInt(page)) ? 1 : parseInt(page)) : 1;
            // Si el valor de status es diferente de 'true' o 'false', se asigna null
            status = status && (status === 'true' || status === 'false') ? status === 'true' ? true : false : null;
            // Si el valor de category no es un string, se asigna null
            category = category && typeof category === 'string' ? category : null;
            // Si el valor de sort es diferente de 1 o -1, se asigna null
            sort = sort && (parseInt(sort) === 1 || parseInt(sort) === -1) ? { price: parseInt(sort) } : null;
            // Se obtienen los productos con los parámetros de búsqueda
            let products = await Products.getInstance().getProducts({ limit, page, status, category, sort });
            // Si la página es mayor a la cantidad de páginas, se asigna la última página
            if (page > products.totalPages) {
                page = products.totalPages;
                products = await Products.getInstance().getProducts({ limit, page, status, category, sort });
            }
            return products;
        } catch (error) {
            throw error;
        }
    }

    static async getProductsByOwner(queryParams, owner) {
        try {
            let { limit, page, status, category, sort } = queryParams;
            // Si el valor de limit es mayor a 10, se asigna 10, si es menor a 1, se asigna 1, si no es un número, se asigna 10
            limit = limit ? (parseInt(limit) > 10 || parseInt(limit) < 1 || isNaN(parseInt(limit)) ? 10 : parseInt(limit)) : 10;
            // Si el valor de page es menor a 1 o no es un número, se asigna 1
            page = page ? (parseInt(page) < 1 || isNaN(parseInt(page)) ? 1 : parseInt(page)) : 1;
            // Si el valor de status es diferente de 'true' o 'false', se asigna null
            status = status && (status === 'true' || status === 'false') ? status === 'true' ? true : false : null;
            // Si el valor de category no es un string, se asigna null
            category = category && typeof category === 'string' ? category : null;
            // Si el valor de sort es diferente de 1 o -1, se asigna null
            sort = sort && (parseInt(sort) === 1 || parseInt(sort) === -1) ? { price: parseInt(sort) } : null;
            // Se obtienen los productos con los parámetros de búsqueda
            let products = await Products.getInstance().getProductsByOwner({ limit, page, status, category, sort }, owner);
            // Si la página es mayor a la cantidad de páginas, se asigna la última página
            if (page > products.totalPages) {
                page = products.totalPages;
                products = await Products.getInstance().getProductsByOwner({ limit, page, status, category, sort }, owner);
            }
            return products;
        } catch (error) {
            throw error;
        }
    }

    static async getProductById(id) {
        try {
            return await Products.getInstance().getProductById(id);
        } catch (error) {
            throw error;
        }
    }

    static async getProductByCode(code) {
        try {
            return await Products.getInstance().getProductByCode(code);
        } catch (error) {
            throw error;
        }
    }

    static async createProduct(product) {
        try {
            if (product.stock === 0) {
                product.status = false;
            }
            const newProduct = new ProductDTO(product);
            return await Products.getInstance().createProduct(newProduct);
        } catch (error) {
            throw error;
        }
    }

    static async updateProduct(id, product) {
        try {
            if (product.stock === 0) {
                product.status = false;
            }
            const updatedProduct = new ProductDTO(product);
            return await Products.getInstance().updateProduct(id, updatedProduct);
        } catch (error) {
            throw error;
        }
    }

    static async deleteProduct(id) {
        try {
            return await Products.getInstance().deleteProduct(id);
        } catch (error) {
            throw error;
        }
    }
}