import cartModel from './models/cart.model.js';

export default class CartsMongoDAO {
    static #instance;

    constructor() { }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new CartsMongoDAO();
        }
        return this.#instance;
    }

    async createCart() {
        try {
            return await cartModel.create({});
        } catch (error) {
            throw error;
        }
    }

    async getCartById(id) {
        try {
            return await cartModel.findOne({ _id: id }).lean();
        } catch (error) {
            throw error;
        }
    }

    async addProduct(cart, product, quantity) {
        try {
            // Se verifica si el producto ya existe en el carrito
            const productIndex = cart.products.findIndex(p => p.product._id.toString() === product._id.toString());
            // Si el producto ya existe, se suma la cantidad. Si no, se agrega al carrito
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product, quantity });
            }
            return await cartModel.findByIdAndUpdate(cart._id, { products: cart.products }, { new: true });
        } catch (error) {
            throw error;
        }
    }

    async updateProductQuantity(cart, product, quantity) {
        try {
            // Se verifica si el producto ya existe en el carrito
            const productIndex = cart.products.findIndex(p => p.product._id.toString() === product._id.toString());
            // Si el producto no existe, se retorna null.
            if (productIndex === -1) {
                return null;
            }
            // Si el producto existe, se actualiza la cantidad
            cart.products[productIndex].quantity = quantity;
            return await cartModel.findByIdAndUpdate(cart._id, { products: cart.products }, { new: true });
        } catch (error) {
            throw error;
        }
    }

    async removeProduct(cart, product) {
        try {
            // Se verifica si el producto ya existe en el carrito
            const productIndex = cart.products.findIndex(p => p.product._id.toString() === product._id.toString());
            // Si el producto no existe, se retorna null.
            if (productIndex === -1) {
                return null;
            }
            // Si el producto existe, se elimina del carrito
            cart.products.splice(productIndex, 1);
            return await cartModel.findByIdAndUpdate(cart._id, { products: cart.products }, { new: true });
        } catch (error) {
            throw error;
        }
    }

    async deleteCart(id) {
        try {
            return await cartModel.findByIdAndUpdate(id, { products: [] }, { new: true });
        } catch (error) {
            throw error;
        }
    }

    async updateCart(cart) {
        try {
            return await cartModel.findByIdAndUpdate(cart._id, { products: cart.products }, { new: true });
        } catch (error) {
            throw error;
        }
    }
}