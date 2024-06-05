import CustomRouter from './custom.router.js';
import CartsController from '../controllers/carts.controller.js';

export default class CartsRouter extends CustomRouter {
    static #instance;

    constructor() {
        super();
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new CartsRouter();
        }
        return this.#instance;
    }

    init() {
        this.post('/', ['PUBLIC'], CartsController.createCart);

        this.get('/:cid', ['USER', 'PREMIUM'], CartsController.getCartById);

        this.post('/:cid/products/:pid', ['USER', 'PREMIUM'], this.validateProductQuantity, CartsController.addProduct);

        this.put('/:cid/products/:pid', ['USER', 'PREMIUM'], this.validateProductQuantity, CartsController.updateProductQuantity);

        this.delete('/:cid/products/:pid', ['USER', 'PREMIUM'], CartsController.removeProduct);

        this.delete('/:cid', ['USER', 'PREMIUM'], CartsController.deleteCart);

        this.post('/:cid/purchase', ['USER', 'PREMIUM'], CartsController.purchaseCart);
    }

    validateProductQuantity(req, res, next) {
        // Si la cantidad es menor a 1 o no es un número, se asigna 1
        req.quantity = req.body.quantity ? (parseInt(req.body.quantity) < 1 || isNaN(parseInt(req.body.quantity)) ? 1 : parseInt(req.body.quantity)) : 1;
        next();
    }
}