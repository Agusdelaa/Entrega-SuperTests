import messageModel from './models/message.model.js';

export default class MessagesMongoDAO {
    static #instance;

    constructor() { }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new MessagesMongoDAO();
        }
        return this.#instance;
    }

    async addMessage(message) {
        try {
            return await messageModel.create(message);
        } catch (error) {
            throw error;
        }
    }

    async getMessages() {
        try {
            return await messageModel.find();
        } catch (error) {
            throw error;
        }
    }
}