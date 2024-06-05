import CustomRouter from './custom.router.js';
import ProductsController from '../controllers/products.controller.js';

export default class ProductsRouter extends CustomRouter {
    static #instance;

    constructor() {
        super();
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new ProductsRouter();
        }
        return this.#instance;
    }

    init() {
        this.get('/', ['USER', 'PREMIUM', 'ADMIN'], ProductsController.getProducts);

        this.get('/:pid', ['USER', 'PREMIUM', 'ADMIN'], ProductsController.getProductById);

        this.post('/', ['PREMIUM', 'ADMIN'], this.validateProductFields, ProductsController.createProduct);

        this.put('/:pid', ['PREMIUM', 'ADMIN'], this.validateProductFields, ProductsController.updateProduct);

        this.delete('/:pid', ['PREMIUM', 'ADMIN'], ProductsController.deleteProduct);
    }

    validateProductFields(req, res, next) {
        const { title, code, price } = req.body;
        // Se valida que los campos título, código y precio sean obligatorios
        if (!title || !code || !price) {
            req.logger.warning('Los campos título, código y precio son obligatorios');
            return res.sendUserError('Los campos título, código y precio son obligatorios');
        }
        // Se valida que el precio sea un número positivo
        if (isNaN(price) || price < 0) {
            req.logger.warning('El precio debe ser un número positivo');
            return res.sendUserError('El precio debe ser un número positivo');
        }
        next();
    }
}