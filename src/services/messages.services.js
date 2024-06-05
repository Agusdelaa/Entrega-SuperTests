import MessageDTO from '../dao/dtos/message.dto.js';
import { Messages } from '../dao/factory.js';

export default class MessagesServices {
    static async addMessage(user, text) {
        try {
            const newMessage = new MessageDTO({ user, text });
            return await Messages.getInstance().addMessage(newMessage);
        } catch (error) {
            throw error;
        }
    }

    static async getMessages() {
        try {
            return await Messages.getInstance().getMessages();
        } catch (error) {
            throw error;
        }
    }
}