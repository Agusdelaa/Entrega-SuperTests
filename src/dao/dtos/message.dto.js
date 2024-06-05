export default class MessageDTO {
    constructor(message) {
        this.user = message.user.trim();
        this.text = message.text.trim();
        this.date = new Date();
    }
}