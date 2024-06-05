import { Schema, SchemaTypes, model } from 'mongoose';

const usersCollection = 'users';

const userSchema = new Schema({
    first_name: { type: String, required: true, filter: true },
    last_name: { type: String, filter: true },
    email: { type: String, required: true, unique: true, filter: true },
    age: { type: Number },
    password: { type: String },
    cart: { type: SchemaTypes.ObjectId, ref: 'carts', unique: true },
    role: { type: String }
});

const userModel = model(usersCollection, userSchema);

export default userModel;