import passport from 'passport';
import local from 'passport-local';
import github from 'passport-github2';
import jwt from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { isValidPassword } from '../utils/passwords.utils.js';
import UsersServices from '../services/users.services.js';
import config from './config.js';

const cookieExtractor = req => req?.signedCookies?.token ?? null;

const initializePassport = () => {
    passport.use('register', new local.Strategy(
        { usernameField: 'email', passReqToCallback: true },
        async (req, username, password, done) => {
            try {
                const { first_name, last_name, age } = req.body;
                if (!first_name || !last_name || !username || !password) {
                    return done(null, false, 'Los campos nombre, apellido, correo electrónico y contraseña son obligatorios');
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(username)) {
                    return done(null, false, 'El correo electrónico ingresado no es válido');
                }
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                if (!passwordRegex.test(password)) {
                    return done(null, false, 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un caracter especial');
                }
                const user = await UsersServices.getInstance().getUserByEmail(username);
                if (user) {
                    return done(null, false, `Ya existe un usuario registrado con el correo electrónico ${username}`);
                }
                const newUser = await UsersServices.getInstance().createUser({
                    first_name,
                    last_name,
                    email: username,
                    age,
                    password
                });
                return done(null, newUser);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('login', new local.Strategy(
        { usernameField: 'email', passReqToCallback: true },
        async (req, username, password, done) => {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    return done(null, false, 'Los campos correo electrónico y contraseña son obligatorios');
                }
                if (email === config.adminEmail && password === config.adminPassword) {
                    return done(null, {
                        first_name: 'Admin',
                        email: config.adminEmail,
                        role: 'admin'
                    });
                }
                const user = await UsersServices.getInstance().getUserByEmail(username);
                if (!user) {
                    return done(null, false, `No existe un usuario registrado con el correo electrónico ${username}`);
                }
                if (!isValidPassword(password, user)) {
                    return done(null, false, 'La contraseña ingresada es incorrecta');
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('github', new github.Strategy(
        {
            clientID: config.gitHubClientId,
            clientSecret: config.gitHubClientSecret,
            callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await UsersServices.getInstance().getUserByEmail(profile._json.email);
                if (user) {
                    return done(null, user);
                } else {
                    const newUser = await UsersServices.getInstance().createUser({
                        first_name: profile._json.name,
                        email: profile._json.email,
                    });
                    return done(null, newUser);
                }
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use('current', new jwt.Strategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: config.jwtSecret
        },
        async (jwtPayload, done) => {
            try {
                return done(null, jwtPayload);
            } catch (error) {
                return done(error);
            }
        }
    ));
}

export default initializePassport;