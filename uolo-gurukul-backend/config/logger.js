const winston = require('winston');

// Define the log levels and their corresponding colors
const logLevels = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  http: 'http',
  debug: 'debug',
};

// Define Winston logger configuration
const logger = winston.createLogger({
  level: 'info', // Set default log level
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    // Console transport for logging to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} ${level}: ${message}`;
        })
      )
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

module.exports = logger;
