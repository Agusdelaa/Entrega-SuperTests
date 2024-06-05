import productModel from './models/product.model.js';

export default class ProductsMongoDAO {
    static #instance;

    constructor() { }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new ProductsMongoDAO();
        }
        return this.#instance;
    }

    async getProducts(queryParams) {
        try {
            const { limit, page, status, category, sort } = queryParams;
            // Se crea un objeto con los filtros que se aplicarán a la consulta
            const filter = {};
            // Si el parámetro status no es nulo, se agrega al filtro
            if (status !== null) {
                filter.status = status;
            }
            // Si el parámetro category no es nulo, se agrega al filtro
            if (category) {
                filter.category = category;
            }
            return await productModel.paginate(filter, { limit, page, sort, lean: true });
        } catch (error) {
            throw error;
        }
    }

    async getProductsByOwner(queryParams, owner) {
        try {
            const { limit, page, status, category, sort } = queryParams;
            // Se crea un objeto con los filtros que se aplicarán a la consulta
            const filter = { owner };
            // Si el parámetro status no es nulo, se agrega al filtro
            if (status !== null) {
                filter.status = status;
            }
            // Si el parámetro category no es nulo, se agrega al filtro
            if (category) {
                filter.category = category;
            }
            return await productModel.paginate(filter, { limit, page, sort, lean: true });
        } catch (error) {
            throw error;
        }
    }

    async getProductById(id) {
        try {
            return await productModel.findById(id).lean();
        } catch (error) {
            throw error;
        }
    }

    async getProductByCode(code) {
        try {
            return await productModel.findOne({ code });
        } catch (error) {
            throw error;
        }
    }

    async createProduct(product) {
        try {
            return await productModel.create(product);
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(id, product) {
        try {
            return await productModel.findByIdAndUpdate(id, product, { new: true });
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            return await productModel.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
}