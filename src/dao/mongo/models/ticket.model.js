import { Schema, SchemaTypes, model } from 'mongoose';

const ticketsCollection = 'tickets';

const ticketSchema = new Schema({
    code: { type: String, unique: true, required: true },
    purchase_datetime: { type: Date, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }
});

const ticketModel = model(ticketsCollection, ticketSchema);

export default ticketModel;