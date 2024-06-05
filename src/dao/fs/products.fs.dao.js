import fs from 'fs';

export default class ProductsFsDAO {
    static #instance;
    url = 'src/dao/fs/data/products.json';

    constructor() {
        this.products = [];
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new ProductsFsDAO();
        }
        this.#instance.products = JSON.parse(fs.readFileSync(this.#instance.url, 'utf-8'));
        return this.#instance;
    }

    getProducts(queryParams) {
        try {
            const { limit, page, status, category, sort } = queryParams;
            let filteredProducts = this.products;
            if (status !== null) {
                filteredProducts = filteredProducts.filter(product => product.status === status);
            }
            if (category) {
                filteredProducts = filteredProducts.filter(product => product.category === category);
            }
            const totalDocs = filteredProducts.length;
            if (sort) {
                const sortByKey = Object.keys(sort)[0];
                const sortOrder = sort[sortByKey];
                filteredProducts.sort((a, b) => {
                    if (a[sortByKey] < b[sortByKey]) return -1 * sortOrder;
                    if (a[sortByKey] > b[sortByKey]) return 1 * sortOrder;
                    return 0;
                });
            }
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
            const totalPages = Math.ceil(totalDocs / limit);
            const pagingCounter = (page - 1) * limit + 1;
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
            const prevPage = hasPrevPage ? page - 1 : null;
            const nextPage = hasNextPage ? page + 1 : null;
            return {
                docs: paginatedProducts,
                totalDocs,
                limit,
                totalPages,
                page,
                pagingCounter,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage
            };
        } catch (error) {
            throw error;
        }
    }

    getProductsByOwner(queryParams, owner) {
        try {
            const { limit, page, status, category, sort } = queryParams;
            let filteredProducts = this.products.filter(product => product.owner === owner);
            if (status !== null) {
                filteredProducts = filteredProducts.filter(product => product.status === status);
            }
            if (category) {
                filteredProducts = filteredProducts.filter(product => product.category === category);
            }
            const totalDocs = filteredProducts.length;
            if (sort) {
                const sortByKey = Object.keys(sort)[0];
                const sortOrder = sort[sortByKey];
                filteredProducts.sort((a, b) => {
                    if (a[sortByKey] < b[sortByKey]) return -1 * sortOrder;
                    if (a[sortByKey] > b[sortByKey]) return 1 * sortOrder;
                    return 0;
                });
            }
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
            const totalPages = Math.ceil(totalDocs / limit);
            const pagingCounter = (page - 1) * limit + 1;
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
            const prevPage = hasPrevPage ? page - 1 : null;
            const nextPage = hasNextPage ? page + 1 : null;
            return {
                docs: paginatedProducts,
                totalDocs,
                limit,
                totalPages,
                page,
                pagingCounter,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage
            };
        } catch (error) {
            throw error;
        }
    }

    getProductById(id) {
        try {
            id = parseInt(id);
            return this.products.find(product => product._id === id);
        } catch (error) {
            throw error;
        }
    }

    async getProductByCode(code) {
        try {
            return this.products.find(product => product.code === code);
        } catch (error) {
            throw error;
        }
    }

    createProduct(product) {
        try {
            const lastProduct = this.products[this.products.length - 1];
            const newProduct = {
                _id: lastProduct?._id + 1 || 1,
                ...product,
            }
            this.products.push(newProduct);
            fs.writeFileSync(this.url, JSON.stringify(this.products, null, '\t'));
            return newProduct;
        } catch (error) {
            throw error;
        }
    }

    updateProduct(id, product) {
        try {
            id = parseInt(id);
            const updatedProduct = {
                _id: id,
                ...product
            }
            const index = this.products.findIndex(product => product._id === id);
            this.products[index] = updatedProduct;
            fs.writeFileSync(this.url, JSON.stringify(this.products, null, '\t'));
            return this.products[index];
        } catch (error) {
            throw error;
        }
    }

    deleteProduct(id) {
        try {
            id = parseInt(id);
            const index = this.products.findIndex(product => product._id === id);
            const deletedProduct = this.products.splice(index, 1);
            fs.writeFileSync(this.url, JSON.stringify(this.products, null, '\t'));
            return deletedProduct;
        } catch (error) {
            throw error;
        }
    }
}