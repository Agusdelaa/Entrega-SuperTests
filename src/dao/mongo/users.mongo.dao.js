import userModel from './models/user.model.js';

export default class UsersMongoDAO {
    static #instance;

    constructor() { }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new UsersMongoDAO();
        }
        return this.#instance;
    }

    async createUser(user) {
        try {
            return await userModel.create(user);
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id) {
        try {
            return await userModel.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            return await userModel.findOne({ email });
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id, user) {
        try {
            return await userModel.findByIdAndUpdate(id, user, { new: true });
        } catch (error) {
            throw error;
        }
    }
}