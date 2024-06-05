import { Server } from 'socket.io';
import MessagesServices from '../services/messages.services.js';

const initializeSocket = (httpServer) => {
    const io = new Server(httpServer);
    // Se envían todos los mensajes al cliente cuando se conecta
    io.on('connection', async (socket) => {
        try {
            const messages = await MessagesServices.getMessages();
            socket.emit('loadMessages', messages);
        } catch (error) {
            socket.emit('loadMessages', []);
        }
        // Se guarda el mensaje recibido en la base de datos y se envían todos los mensajes a todos los clientes
        socket.on('saveMessage', async (user, text) => {
            try {
                await MessagesServices.addMessage(user, text);
                const messages = await MessagesServices.getMessages();
                io.emit('loadMessages', messages);
            } catch (error) {
                io.emit('loadMessages', []);
            }
        });
    });
}

export default initializeSocket;