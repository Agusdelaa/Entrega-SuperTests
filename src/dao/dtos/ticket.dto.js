import { v4 as uuidv4 } from 'uuid';

export default class TicketDTO {
    constructor(ticket) {
        this.code = uuidv4();
        this.purchase_datetime = new Date();
        this.amount = ticket.amount.toFixed(2);
        this.purchaser = ticket.purchaser.trim();
    }
}