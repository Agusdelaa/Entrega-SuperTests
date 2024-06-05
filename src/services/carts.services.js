import { Carts } from '../dao/factory.js';
import ProductsServices from './products.services.js';
import TicketsServices from './tickets.services.js';
import MailingServices from './mailing.services.js';

export default class CartsServices {
    static async createCart() {
        try {
            return await Carts.getInstance().createCart();
        } catch (error) {
            throw error;
        }
    }

    static async getCartById(id) {
        try {
            return await Carts.getInstance().getCartById(id);
        } catch (error) {
            throw error;
        }
    }

    static async addProduct(cart, product, quantity) {
        try {
            return await Carts.getInstance().addProduct(cart, product, quantity);
        } catch (error) {
            throw error;
        }
    }

    static async updateProductQuantity(cart, product, quantity) {
        try {
            return await Carts.getInstance().updateProductQuantity(cart, product, quantity);
        } catch (error) {
            throw error;
        }
    }

    static async removeProduct(cart, product) {
        try {
            return await Carts.getInstance().removeProduct(cart, product);
        } catch (error) {
            throw error;
        }
    }

    static async deleteCart(id) {
        try {
            return await Carts.getInstance().deleteCart(id);
        } catch (error) {
            throw error;
        }
    }

    static async purchaseCart(cart, user) {
        try {
            const productsNotPurchased = [];
            let isProductPurchased = false;
            let amount = 0;
            // Se recorre el carrito de compras para verificar si hay stock de los productos
            for (const item of cart.products) {
                // Si hay stock
                if (item.product.stock >= item.quantity) {
                    // Se suma el precio del producto al monto total
                    amount += item.product.price * item.quantity;
                    // Se elimina el producto del carrito
                    cart.products = cart.products.filter(i => i.product._id !== item.product._id);
                    // Se verifica que se haya comprado al menos un producto
                    isProductPurchased = true;
                    // Se actualiza el stock del producto
                    item.product.stock -= item.quantity;
                    await ProductsServices.updateProduct(item.product._id, item.product);
                } else {
                    // Si no hay stock, se agrega el producto a la lista de productos no comprados
                    productsNotPurchased.push(item.product.title);
                }
            }
            // Si no se compró ningún producto, se retorna un mensaje de error
            if (!isProductPurchased) {
                return { ticket: null, productsNotPurchased };
            }
            // Si se compraron productos, se actualiza el carrito, se crea el ticket y se envía un correo
            cart = await Carts.getInstance().updateCart(cart);
            const ticket = await TicketsServices.createTicket({ amount, purchaser: user.email });
            await MailingServices.getInstance().sendPurchaseConfirmationEmail(user, ticket);
            // Si hay productos no comprados, se retornan junto con el ticket
            if (productsNotPurchased.length > 0) {
                return { ticket, productsNotPurchased };
            }
            // Si se compraron todos los productos, se retorna el ticket
            return { ticket, productsNotPurchased: null };
        } catch (error) {
            throw error;
        }
    }
}