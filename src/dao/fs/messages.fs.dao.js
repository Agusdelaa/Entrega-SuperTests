import fs from 'fs';

export default class MessagesFsDAO {
    static #instance;
    url = 'src/dao/fs/data/messages.json';

    constructor() {
        this.messages = [];
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new MessagesFsDAO();
        }
        this.#instance.messages = JSON.parse(fs.readFileSync(this.#instance.url, 'utf-8'));
        return this.#instance;
    }

    addMessage(message) {
        try {
            this.messages.push(message);
            fs.writeFileSync(this.url, JSON.stringify(this.messages, null, '\t'));
            return message;
        } catch (error) {
            throw error;
        }
    }

    getMessages() {
        try {
            return this.messages;
        } catch (error) {
            throw error;
        }
    }
}