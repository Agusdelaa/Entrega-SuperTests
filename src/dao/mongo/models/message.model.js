import { Schema, model } from 'mongoose';

const messagesCollection = 'messages';

const messageSchema = new Schema({
    user: { type: String, required: true },
    text: { type: String, required: true },
    date: { type: Date, required: true }
});

const messageModel = model(messagesCollection, messageSchema);

export default messageModel;