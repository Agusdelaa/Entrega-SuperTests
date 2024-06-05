import bcrypt from 'bcrypt';
import config from '../config/config.js';

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(config.bcryptSalt));

const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

export { createHash, isValidPassword };