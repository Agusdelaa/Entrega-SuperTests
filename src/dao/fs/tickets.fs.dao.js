import fs from 'fs';

export default class TicketsFsDAO {
    static #instance;
    url = 'src/dao/fs/data/tickets.json';

    constructor() {
        this.tickets = [];
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new TicketsFsDAO();
        }
        this.#instance.tickets = JSON.parse(fs.readFileSync(this.#instance.url, 'utf-8'));
        return this.#instance;
    }

    createTicket(ticket) {
        try {
            const lastTicket = this.tickets[this.tickets.length - 1];
            const newTicket = {
                _id: lastTicket?._id + 1 || 1,
                ...ticket,
            }
            this.tickets.push(newTicket);
            fs.writeFileSync(this.url, JSON.stringify(this.tickets, null, '\t'));
            return newTicket;
        } catch (error) {
            throw error;
        }
    }

    getTicketById(id) {
        try {
            id = parseInt(id);
            return this.tickets.find(ticket => ticket._id === id);
        } catch (error) {
            throw error;
        }
    }
}