export default class UserDTO {
    constructor(user) {
        this.first_name = user.first_name.trim();
        this.last_name = user.last_name?.trim() || '';
        this.email = user.email.trim();
        // Si el valor de user.age es un número, se asigna tal cual. Si no es un número o es menor a 0, se asigna 0.
        this.age = user.age ? (Number.isInteger(parseInt(user.age)) && parseInt(user.age) >= 0 ? parseInt(user.age) : 0) : 0;
        this.password = user.password || '';
        this.cart = user.cart;
        this.role = user.role || 'user';
    }
}