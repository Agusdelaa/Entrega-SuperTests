import mongoose from 'mongoose';
import config from '../config/config.js';

export let Products, Carts, Users, Tickets, Messages;

export default async function initializePersistence(persistence) {
    switch (persistence) {
        case 'mongo':
            mongoose.connect(config.mongoUrl)
                .then(() => console.log('Base de datos conectada'))
                .catch(error => console.log(`Error en la conexión a la base de datos: ${error}`));
            const { default: ProductsMongoDAO } = await import('../dao/mongo/products.mongo.dao.js');
            const { default: CartsMongoDAO } = await import('../dao/mongo/carts.mongo.dao.js');
            const { default: UsersMongoDAO } = await import('../dao/mongo/users.mongo.dao.js');
            const { default: TicketsMongoDAO } = await import('../dao/mongo/tickets.mongo.dao.js');
            const { default: MessagesMongoDAO } = await import('../dao/mongo/messages.mongo.dao.js');
            Products = ProductsMongoDAO;
            Carts = CartsMongoDAO;
            Users = UsersMongoDAO;
            Tickets = TicketsMongoDAO;
            Messages = MessagesMongoDAO;
            break;

        case 'fs':
            const { default: ProductsFsDAO } = await import('../dao/fs/products.fs.dao.js');
            const { default: CartsFsDAO } = await import('../dao/fs/carts.fs.dao.js');
            const { default: UsersFsDAO } = await import('../dao/fs/users.fs.dao.js');
            const { default: TicketsFsDAO } = await import('../dao/fs/tickets.fs.dao.js');
            const { default: MessagesFsDAO } = await import('../dao/fs/messages.fs.dao.js');
            Products = ProductsFsDAO;
            Carts = CartsFsDAO;
            Users = UsersFsDAO;
            Tickets = TicketsFsDAO;
            Messages = MessagesFsDAO;
            break;

        default:
            throw new Error('Tipo de persistencia no soportado');
    }
}