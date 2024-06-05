import winston from 'winston';

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'blue',
        http: 'cyan',
        debug: 'white'
    }
};

const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        })
    ]
});

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            level: 'error',
            filename: 'errors.log'
        })
    ]
});

winston.addColors(customLevelOptions.colors);

export const addLogger = (req, res, next) => {
    // Se obtiene el entorno de ejecución
    const environment = process.env.NODE_ENV || 'development';
    // Se carga el logger correspondiente al entorno
    const logger = environment === 'development' ? devLogger : prodLogger;
    // Se añaden los métodos para cada nivel de log
    Object.keys(customLevelOptions.levels).forEach(level => {
        logger[level] = (message) => logger.log({ level, message });
    });
    // No se loguean las peticiones a las rutas de las vistas y de la documentación de la API
    if (!req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/api/docs')) {
        return next();
    }
    // Se añade la fecha y hora de cada petición
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    // Se loguea la petición
    logger.http(`${req.method} ${req.originalUrl} ${currentDate} ${currentTime}`);
    // Se añade el logger a la petición
    req.logger = logger;
    next();
};