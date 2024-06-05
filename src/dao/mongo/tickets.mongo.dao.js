import ticketModel from './models/ticket.model.js';

export default class TicketsMongoDAO {
    static #instance;

    constructor() { }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new TicketsMongoDAO();
        }
        return this.#instance;
    }

    async createTicket(ticket) {
        try {
            return await ticketModel.create(ticket);
        } catch (error) {
            throw error;
        }
    }

    async getTicketById(id) {
        try {
            return await ticketModel.findById(id).lean();
        } catch (error) {
            throw error;
        }
    }
}