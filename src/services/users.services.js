import { createHash } from '../utils/passwords.utils.js';
import CartsServices from './carts.services.js';
import UserDTO from '../dao/dtos/user.dto.js';
import { Users } from '../dao/factory.js';

export default class UsersServices {
    static #instance;

    constructor() { }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new UsersServices();
        }
        return this.#instance;
    }

    async createUser(user) {
        try {
            // Se valida si el usuario tiene una contraseña y si la tiene, se encripta
            if (user.password && user.password.length > 0) {
                user.password = createHash(user.password);
            }
            // Se crea un carrito para el usuario y se le asigna
            const cart = await CartsServices.createCart();
            user.cart = cart._id;
            const newUser = new UserDTO(user);
            return await Users.getInstance().createUser(newUser);
        } catch (error) {
            throw error;
        }
    }

    async getUserById(id) {
        try {
            return await Users.getInstance().getUserById(id);
        } catch (error) {
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            return await Users.getInstance().getUserByEmail(email);
        } catch (error) {
            throw error;
        }
    }

    async updateUserPassword(id, user) {
        try {
            if (user.password && user.password.length > 0) {
                user.password = createHash(user.password);
            }
            const updatedUser = new UserDTO(user);
            return await Users.getInstance().updateUser(id, updatedUser);
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id, user) {
        try {
            const updatedUser = new UserDTO(user);
            return await Users.getInstance().updateUser(id, updatedUser);
        } catch (error) {
            throw error;
        }
    }
}