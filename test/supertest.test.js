import * as chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

// Variables globales para los tests
// Users
let userId;
let userEmail;
let token;
const validEmail = 'user@mail.com';
const invalidEmail = 'email';
const validPassword = 'Password123!';
const invalidPassword = 'password';
const newUser = {
    first_name: 'user_first_name',
    last_name: 'user_last_name',
    email: validEmail,
    password: validPassword
};
const userWithoutFirstName = {
    last_name: 'user_last_name',
    email: validEmail,
    password: validPassword
};
const userWithoutLastName = {
    first_name: 'user_first_name',
    email: validEmail,
    password: validPassword
};
const userWithoutEmail = {
    first_name: 'user_first_name',
    last_name: 'user_last_name',
    password: validPassword
};
const userWithoutPassword = {
    first_name: 'user_first_name',
    last_name: 'user_last_name',
    email: validEmail
};
const userWithInvalidEmail = {
    first_name: 'user_first_name',
    last_name: 'user_last_name',
    email: invalidEmail,
    password: validPassword
};
const userWithInvalidPassword = {
    first_name: 'user_first_name',
    last_name: 'user_last_name',
    email: validEmail,
    password: invalidPassword
};
const unregisteredUser = {
    email: 'unregistered@mail.com',
    password: 'unregistered'
};
// Carts
let cartId;
let existingProductId1;
let existingProductId2;
const quantity = Math.floor(Math.random() * 10) + 1;
const updatedQuantity = Math.floor(Math.random() * 10) + 1;
updatedQuantity === quantity ? updatedQuantity + 1 : updatedQuantity;
// Products
let productId;
const newProduct = {
    title: 'Producto de prueba',
    code: 'PDP',
    price: 100,
    owner: newUser.email
};
const updatedProduct = {
    title: 'Producto de prueba actualizado',
    code: 'PDP',
    price: 100,
    owner: newUser.email
};
const productWithoutTitle = {
    code: 'PDP',
    price: 100
};
const productWithoutCode = {
    title: 'Producto de prueba',
    price: 100
};
const productWithoutPrice = {
    title: 'Producto de prueba',
    code: 'PDP'
};

describe('Entrega Test', () => {
    describe('Test de Users', () => {
        describe('POST /api/sessions/register', () => {
            it('Debería crear un usuario', async () => {
                const response = await requester.post('/api/sessions/register').send(newUser);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
            });
            it('No debería crear un usuario con correo electrónico repetido', async () => {
                const response = await requester.post('/api/sessions/register').send(newUser);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un usuario sin nombre', async () => {
                const response = await requester.post('/api/sessions/register').send(userWithoutFirstName);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un usuario sin apellido', async () => {
                const response = await requester.post('/api/sessions/register').send(userWithoutLastName);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un usuario sin correo electrónico', async () => {
                const response = await requester.post('/api/sessions/register').send(userWithoutEmail);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un usuario sin contraseña', async () => {
                const response = await requester.post('/api/sessions/register').send(userWithoutPassword);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un usuario con correo electrónico inválido', async () => {
                const response = await requester.post('/api/sessions/register').send(userWithInvalidEmail);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un usuario con contraseña inválida', async () => {
                const response = await requester.post('/api/sessions/register').send(userWithInvalidPassword);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
        });

        describe('POST /api/sessions/login', () => {
            it('Debería iniciar sesión con un usuario registrado, generar un token y almacenarlo en una cookie', async () => {
                const response = await requester.post('/api/sessions/login').send({ email: newUser.email, password: newUser.password });
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                const cookies = response.headers['set-cookie'];
                expect(cookies).to.not.be.undefined;
                token = cookies.find(cookie => cookie.startsWith('token='));
                expect(token).to.not.be.undefined;
            });
            it('No debería iniciar sesión con un usuario no registrado', async () => {
                const response = await requester.post('/api/sessions/login').send({ email: unregisteredUser.email, password: unregisteredUser.password });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería iniciar sesión con una contraseña incorrecta', async () => {
                const response = await requester.post('/api/sessions/login').send({ email: newUser.email, password: unregisteredUser.password });
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
        });


        describe('GET /api/sessions/current', () => {
            it('Debería devolver el usuario autenticado', async () => {
                const response = await requester.get('/api/sessions/current').set('Cookie', token);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                userId = response.body.payload._id;
                userEmail = response.body.payload.email;
                cartId = response.body.payload.cart;
            });
            it('No debería devolver el usuario si no está autenticado', async () => {
                const response = await requester.get('/api/sessions/current');
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal('error');
            });
        });

        describe('PUT /api/sessions/premium/:userId', () => {
            it('Debería cambiar el rol de un usuario comun a premium y viceversa', async () => {
                const response = await requester.put(`/api/sessions/premium/${userId}`).set('Cookie', token);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                const cookies = response.headers['set-cookie'];
                token = cookies.find(cookie => cookie.startsWith('token='));
            });
        });

        describe('POST /api/sessions/logout', () => {
            it('Debería cerrar la sesión de un usuario autenticado', async () => {
                const response = await requester.post('/api/sessions/logout').set('Cookie', token);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
            });
            it('No debería cerrar la sesión de un usuario si no está autenticado', async () => {
                const response = await requester.post('/api/sessions/logout');
                expect(response.status).to.equal(401);
                expect(response.body.status).to.equal('error');
            });
        });
    });

    describe('Test de Products', () => {
        describe('GET /api/products', () => {
            it('Debería devolver un array de productos', async () => {
                const response = await requester.get('/api/products').set('Cookie', token);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(Array.isArray(response.body.payload.docs)).to.be.true;
                existingProductId1 = response.body.payload.docs[0]._id;
                existingProductId2 = response.body.payload.docs[1]._id;
            });
        });

        describe('GET /api/products/:pid', () => {
            it('Debería devolver un producto', async () => {
                const response = await requester.get(`/api/products/${existingProductId1}`).set('Cookie', token);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
            });
        });

        describe('POST /api/products', () => {
            it('Debería crear un producto', async () => {
                const response = await requester.post('/api/products').set('Cookie', token).send(newProduct);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload._id).to.not.be.null;
                productId = response.body.payload._id;
            });
            it('No debería crear un producto sin título', async () => {
                const response = await requester.post('/api/products').set('Cookie', token).send(productWithoutTitle);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un producto sin código', async () => {
                const response = await requester.post('/api/products').set('Cookie', token).send(productWithoutCode);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un producto sin precio', async () => {
                const response = await requester.post('/api/products').set('Cookie', token).send(productWithoutPrice);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería crear un producto con código repetido', async () => {
                const response = await requester.post('/api/products').set('Cookie', token).send(newProduct);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
        });

        describe('PUT /api/products/:pid', () => {
            it('Debería actualizar un producto', async () => {
                const response = await requester.put(`/api/products/${productId}`).set('Cookie', token).send(updatedProduct);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload.title).to.equal('Producto de prueba actualizado');
            });
            it('No debería actualizar un producto sin título', async () => {
                const response = await requester.put(`/api/products/${productId}`).set('Cookie', token).send(productWithoutTitle);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería actualizar un producto sin código', async () => {
                const response = await requester.put(`/api/products/${productId}`).set('Cookie', token).send(productWithoutCode);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
            it('No debería actualizar un producto sin precio', async () => {
                const response = await requester.put(`/api/products/${productId}`).set('Cookie', token).send(productWithoutPrice);
                expect(response.status).to.equal(400);
                expect(response.body.status).to.equal('error');
            });
        });

        describe('DELETE /api/products/:pid', () => {
            it('Debería eliminar un producto', async () => {
                const response = await requester.delete(`/api/products/${productId}`).set('Cookie', token);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
            });
        });
    });

    describe('Test de Carts', () => {
        describe('GET /api/carts/:cid', () => {
            it('Debería devolver un carrito', async () => {
                const response = await requester.get(`/api/carts/${cartId}`).set('Cookie', token);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
            });
        });

        describe('POST /api/carts/:cid/products/:pid', () => {
            it('Debería agregar un producto al carrito', async () => {
                const response = await requester.post(`/api/carts/${cartId}/products/${existingProductId1}`).set('Cookie', token).send({ quantity: quantity });
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload.products).to.have.lengthOf(1);
            });
            it('Si el producto ya está en el carrito, debería incrementar la cantidad', async () => {
                const response = await requester.post(`/api/carts/${cartId}/products/${existingProductId1}`).set('Cookie', token).send({ quantity: quantity });
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload.products).to.have.lengthOf(1);
            });
            it('Si el producto no existe, debería agregarlo al carrito', async () => {
                const response = await requester.post(`/api/carts/${cartId}/products/${existingProductId2}`).set('Cookie', token).send({ quantity: quantity });
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload.products).to.have.lengthOf(2);
            });
        });

        describe('PUT /api/carts/:cid/products/:pid', () => {
            it('Debería actualizar la cantidad de un producto en el carrito', async () => {
                const response = await requester.put(`/api/carts/${cartId}/products/${existingProductId1}`).set('Cookie', token).send({ quantity: updatedQuantity });
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload.products[0].quantity).to.equal(updatedQuantity);
            });
        });

        describe('DELETE /api/carts/:cid/products/:pid', () => {
            it('Debería eliminar un producto del carrito', async () => {
                await requester.post(`/api/carts/${cartId}/products/${existingProductId2}`).set('Cookie', token).send({ quantity: quantity });
                const response = await requester.delete(`/api/carts/${cartId}/products/${existingProductId1}`).set('Cookie', token);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload.products).to.not.include({ _id: existingProductId1 });
            });
        });

        describe('DELETE /api/carts/:cid', () => {
            it('Debería vaciar un carrito', async () => {
                const response = await requester.delete(`/api/carts/${cartId}`).set('Cookie', token);
                expect(response.status).to.equal(200);
                expect(response.body.status).to.equal('success');
                expect(response.body.payload.products).to.be.empty;
            });
        });
    });
});