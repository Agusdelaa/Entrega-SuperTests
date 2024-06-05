import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const generateToken = user => jwt.sign(user, config.jwtSecret, { expiresIn: config.jwtExpiration });

const validateToken = token => {
    try {
        return jwt.verify(token, config.jwtSecret);
    } catch (error) {
        return null;
    }
}

export { generateToken, validateToken };