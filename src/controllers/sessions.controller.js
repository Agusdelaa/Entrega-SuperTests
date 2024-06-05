import { generateToken, validateToken } from '../utils/tokens.utils.js';
import config from '../config/config.js';
import UsersServices from '../services/users.services.js';
import MailingServices from '../services/mailing.services.js';
import { isValidPassword } from '../utils/passwords.utils.js';
import UserWithoutPasswordDTO from '../dao/dtos/user.without.password.dto.js';

export default class SessionsController {
    static register(req, res) {
        req.logger.info(`Usuario ${req.body.email} registrado exitosamente`);
        res.sendSuccessMessage('Usuario registrado exitosamente');
    }

    static login(req, res) {
        const user = req.user;
        const token = generateToken(user);
        res.cookie('token', token, { maxAge: config.cookieMaxAge, httpOnly: true, signed: true });
        req.logger.info(`Sesión de usuario ${user.email} iniciada exitosamente`);
        res.sendSuccessPayload(req.user);
    }

    static githubCallback(req, res) {
        const user = req.user;
        const token = generateToken(user);
        res.cookie('token', token, { maxAge: config.cookieMaxAge, httpOnly: true, signed: true });
        req.logger.info(`Sesión de usuario ${user.email} iniciada exitosamente con GitHub`);
        res.redirect('/products');
    }

    static async restorePassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                req.logger.warning('El campo correo electrónico es obligatorio');
                return res.sendUserError('El campo correo electrónico es obligatorio');
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                req.logger.warning('El correo electrónico ingresado no es válido');
                return res.sendUserError('El correo electrónico ingresado no es válido');
            }
            const user = await UsersServices.getInstance().getUserByEmail(email);
            if (!user) {
                req.logger.warning(`No existe un usuario registrado con el correo electrónico ${email}`);
                return res.sendUserError(`No existe un usuario registrado con el correo electrónico ${email}`);
            }
            const token = generateToken({ email });
            const resetLink = `http://localhost:8080/reset-password?token=${token}`;
            await MailingServices.getInstance().sendResetPasswordEmail(user, resetLink);
            req.logger.info(`Correo electrónico enviado exitosamente a ${user.email} con las instrucciones para restaurar contraseña`);
            res.sendSuccessMessage(`Se ha enviado un correo electrónico a ${user.email} con las instrucciones para restaurar tu contraseña`);
        } catch (error) {
            req.loger.error(`Error al restaurar contraseña de usuario ${email}: ${error.message}`);
            res.sendServerError(error.message);
        }
    }

    static async resetPassword(req, res) {
        try {
            const { token, password } = req.body;
            if (!password) {
                req.logger.warning('El campo contraseña es obligatorio');
                return res.sendUserError('El campo contraseña es obligatorio');
            }
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                req.logger.warning('La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un caracter especial');
                return res.sendUserError('La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un caracter especial');
            }
            // Se valida el token
            const decoded = validateToken(token);
            if (!decoded) {
                req.logger.warning('No se ha proporcionado un token válido');
                return res.sendUserError('No se ha proporcionado un token válido');
            }
            // Se busca el usuario asociado al token
            const user = await UsersServices.getInstance().getUserByEmail(decoded.email);
            if (!user) {
                req.logger.warning('No se ha encontrado un usuario asociado al token proporcionado');
                return res.sendUserError('No se ha encontrado un usuario asociado al token proporcionado');
            }
            // Se verifica que la nueva contraseña sea diferente a la anterior
            if (isValidPassword(password, user)) {
                req.logger.warning('La nueva contraseña no puede ser igual a la anterior');
                return res.sendUserError('La nueva contraseña no puede ser igual a la anterior');
            }
            // Se actualiza la contraseña del usuario
            user.password = password;
            await UsersServices.getInstance().updateUserPassword(user._id, user);
            req.logger.info(`Contraseña de usuario ${user.email} reestablecida exitosamente`);
            res.sendSuccessMessage('Contraseña reestablecida exitosamente');
        } catch (error) {
            req.logger.error(`Error al reestablecer contraseña de usuario ${decoded.email}: ${error.message}`);
            res.sendServerError(error.message);
        }
    }

    static async changeUserRole(req, res) {
        try {
            const { uid } = req.params;
            // Se busca el usuario por su id
            const user = await UsersServices.getInstance().getUserById(uid);
            // Se cambia el rol  y se actualiza el usuario
            user.role = user.role === 'user' ? 'premium' : 'user';
            await UsersServices.getInstance().updateUser(uid, user);
            // Se elimina la contraseña del usuario y se actualiza la petición
            const UserWithoutPassword = new UserWithoutPasswordDTO(user);
            req.user = { ...UserWithoutPassword };
            // Se genera un nuevo token con el usuario actualizado y se almacena en una cookie
            const token = generateToken(req.user);
            res.cookie('token', token, { maxAge: config.cookieMaxAge, httpOnly: true, signed: true });
            req.logger.info(`Rol de usuario ${user.email} modificado exitosamente a ${user.role}`);
            res.sendSuccessMessage(`Rol de usuario ${user.email} modificado exitosamente a ${user.role}`);
        } catch (error) {
            req.logger.error(`Error al cambiar rol de usuario ${user.email}: ${error.message}`);
            res.sendServerError(error.message);
        }
    }

    static current(req, res) {
        res.sendSuccessPayload(req.user);
    }

    static logout(req, res) {
        res.clearCookie('token');
        req.logger.info(`Sesión de usuario ${req.user.email} cerrada exitosamente`);
        res.sendSuccessMessage('Sesión cerrada exitosamente');
    }
}