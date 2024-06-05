import fs from 'fs';

export default class UsersFsDAO {
    static #instance;
    url = 'src/dao/fs/data/users.json';

    constructor() {
        this.users = [];
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new UsersFsDAO();
        }
        this.#instance.users = JSON.parse(fs.readFileSync(this.#instance.url, 'utf-8'));
        return this.#instance;
    }

    createUser(user) {
        try {
            const lastUser = this.users[this.users.length - 1];
            const newUser = {
                _id: lastUser?._id + 1 || 1,
                ...user,
            }
            this.users.push(newUser);
            fs.writeFileSync(this.url, JSON.stringify(this.users, null, '\t'));
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    getUserById(id) {
        try {
            return this.users.find(user => user._id === id);
        } catch (error) {
            throw error;
        }
    }

    getUserByEmail(email) {
        try {
            return this.users.find(user => user.email === email);
        } catch (error) {
            throw error;
        }
    }

    updateUser(id, user) {
        try {
            const index = this.users.findIndex(user => user._id === id);
            if (index === -1) {
                return null;
            }
            const updatedUser = {
                _id: id,
                ...user
            }
            this.users[index] = updatedUser;
            fs.writeFileSync(this.url, JSON.stringify(this.users, null, '\t'));
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }
}