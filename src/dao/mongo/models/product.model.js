import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = 'products';

const productSchema = new Schema({
    title: { type: String, required: true, index: true },
    description: { type: String },
    code: { type: String, required: true, unique: true, index: true },
    price: { type: Number, required: true },
    status: { type: Boolean },
    stock: { type: Number },
    category: { type: String, index: true },
    thumbnails: { type: [String] },
    owner: { type: String }
});

productSchema.plugin(mongoosePaginate);

const productModel = model(productsCollection, productSchema);

export default productModel;