import fs from 'fs';

export default class CartsFsDAO {
    static #instance;
    url = 'src/dao/fs/data/carts.json';

    constructor() {
        this.carts = [];
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new CartsFsDAO();
        }
        this.#instance.carts = JSON.parse(fs.readFileSync(this.#instance.url, 'utf-8'));
        return this.#instance;
    }

    createCart() {
        try {
            const lastCart = this.carts[this.carts.length - 1];
            const newCart = {
                _id: lastCart ? lastCart._id + 1 : 1,
                products: []
            }
            this.carts.push(newCart);
            fs.writeFileSync(this.url, JSON.stringify(this.carts, null, '\t'));
            return newCart;
        } catch (error) {
            throw error;
        }
    }

    getCartById(id) {
        try {
            id = parseInt(id);
            return this.carts.find(cart => cart._id === id);
        } catch (error) {
            throw error;
        }
    }

    addProduct(cart, product, quantity) {
        try {
            const productIndex = cart.products.findIndex(p => p.product._id === product._id);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product, quantity });
            }
            const cartIndex = this.carts.findIndex(c => c._id === cart._id);
            this.carts[cartIndex] = cart;
            fs.writeFileSync(this.url, JSON.stringify(this.carts, null, '\t'));
            return this.carts[cartIndex];
        } catch (error) {
            throw error;
        }
    }

    updateProductQuantity(cart, product, quantity) {
        try {
            const productIndex = cart.products.findIndex(p => p.product._id === product._id);
            if (productIndex === -1) {
                return null;
            }
            cart.products[productIndex].quantity = quantity;
            const cartIndex = this.carts.findIndex(c => c._id === cart._id);
            this.carts[cartIndex] = cart;
            fs.writeFileSync(this.url, JSON.stringify(this.carts, null, '\t'));
            return this.carts[cartIndex];
        } catch (error) {
            throw error;
        }
    }

    removeProduct(cart, product) {
        try {
            const productIndex = cart.products.findIndex(p => p.product._id === product._id);
            if (productIndex === -1) {
                return null;
            }
            cart.products.splice(productIndex, 1);
            const cartIndex = this.carts.findIndex(c => c._id === cart._id);
            this.carts[cartIndex] = cart;
            fs.writeFileSync(this.url, JSON.stringify(this.carts, null, '\t'));
            return this.carts[cartIndex];
        } catch (error) {
            throw error;
        }
    }

    deleteCart(id) {
        try {
            id = parseInt(id);
            const cartIndex = this.carts.findIndex(cart => cart._id === id);
            this.carts[cartIndex].products = [];
            fs.writeFileSync(this.url, JSON.stringify(this.carts, null, '\t'));
            return this.carts[cartIndex];
        } catch (error) {
            throw error;
        }
    }

    updateCart(cart) {
        try {
            const cartIndex = this.carts.findIndex(c => c._id === cart._id);
            this.carts[cartIndex] = cart;
            fs.writeFileSync(this.url, JSON.stringify(this.carts, null, '\t'));
            return this.carts[cartIndex];
        } catch (error) {
            throw error;
        }
    }
}