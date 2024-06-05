import { Schema, SchemaTypes, model } from 'mongoose';

const cartsCollection = 'carts';

const cartSchema = new Schema({
    products: {
        type: [
            {
                product: { type: SchemaTypes.ObjectId, ref: 'products' },
                quantity: { type: Number }
            },
        ],
        default: [],
    }
});

cartSchema.pre('findOne', function (next) {
    this.populate('products.product');
    next();
});

const cartModel = model(cartsCollection, cartSchema);

export default cartModel;