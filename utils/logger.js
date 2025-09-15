// utils/logger.js
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = process.env.LOG_FILE_PATH || './logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format for structured logging
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...(stack && { stack }),
      ...(Object.keys(meta).length && { meta })
    });
  })
);

// Custom format for console output (more readable)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${message}${stack ? `\n${stack}` : ''}`;
  })
);

// Configure daily rotating file transport for general logs
const dailyRotateFileTransport = new DailyRotateFile({
  filename: path.join(logsDir, 'app-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: process.env.MAX_LOG_SIZE || '20m',
  maxFiles: process.env.MAX_LOG_FILES || '14d',
  format: logFormat
});

// Configure daily rotating file transport for error logs
const errorRotateFileTransport = new DailyRotateFile({
  level: 'error',
  filename: path.join(logsDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: process.env.MAX_LOG_SIZE || '20m',
  maxFiles: process.env.MAX_LOG_FILES || '30d',
  format: logFormat
});

// Create Winston logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'swasthya-health-card' },
  transports: [
    // File transports
    dailyRotateFileTransport,
    errorRotateFileTransport,
    
    // Console transport (only in development or when explicitly enabled)
    ...(process.env.NODE_ENV === 'development' || process.env.ENABLE_CONSOLE_LOG === 'true' ? [
      new winston.transports.Console({
        format: consoleFormat
      })
    ] : [])
  ]
});

// Add request ID to logs when available
logger.addRequestId = (req, res, next) => {
  req.requestId = require('crypto').randomUUID();
  logger.defaultMeta.requestId = req.requestId;
  next();
};

// Structured logging methods
logger.logRequest = (req, res, responseTime) => {
  logger.info('HTTP Request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    responseTime: `${responseTime}ms`,
    statusCode: res.statusCode,
    requestId: req.requestId
  });
};

logger.logError = (error, req = null) => {
  const errorLog = {
    message: error.message,
    stack: error.stack,
    ...(req && {
      method: req.method,
      url: req.url,
      ip: req.ip,
      requestId: req.requestId
    })
  };
  
  logger.error('Application Error', errorLog);
};

logger.logUserAction = (action, userId, details = {}) => {
  logger.info('User Action', {
    action,
    userId,
    details,
    timestamp: new Date().toISOString()
  });
};

logger.logDatabaseOperation = (operation, collection, details = {}) => {
  logger.debug('Database Operation', {
    operation,
    collection,
    details
  });
};

logger.logSecurity = (event, details = {}) => {
  logger.warn('Security Event', {
    event,
    details,
    timestamp: new Date().toISOString()
  });
};

// Log unhandled promise rejections and exceptions
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection', {
    reason: reason.toString(),
    stack: reason.stack,
    promise: promise.toString()
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    message: error.message,
    stack: error.stack
  });
  // Don't exit immediately, let the process complete current operations
  setTimeout(() => process.exit(1), 1000);
});

module.exports = logger;