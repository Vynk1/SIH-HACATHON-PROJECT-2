// middleware/logging.js
const logger = require('../utils/logger');

// Request logging middleware
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Add request ID
  req.requestId = require('crypto').randomUUID();
  
  // Log the incoming request
  logger.info('Incoming Request', {
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    requestId: req.requestId,
    timestamp: new Date().toISOString()
  });
  
  // Override res.json to log responses
  const originalJson = res.json;
  res.json = function(data) {
    const responseTime = Date.now() - startTime;
    
    // Log the response
    logger.info('Request Completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      requestId: req.requestId,
      ip: req.ip || req.connection.remoteAddress
    });
    
    return originalJson.call(this, data);
  };
  
  // Override res.send to log responses
  const originalSend = res.send;
  res.send = function(data) {
    const responseTime = Date.now() - startTime;
    
    // Log the response
    logger.info('Request Completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      requestId: req.requestId,
      ip: req.ip || req.connection.remoteAddress
    });
    
    return originalSend.call(this, data);
  };
  
  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  // Log the error
  logger.error('Request Error', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    requestId: req.requestId,
    userAgent: req.get('User-Agent'),
    body: req.method !== 'GET' ? req.body : undefined,
    params: req.params,
    query: req.query
  });
  
  next(err);
};

// Security event logger
const securityLogger = (event, req, details = {}) => {
  logger.warn('Security Event', {
    event,
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    requestId: req.requestId,
    userId: req.user ? req.user.id : null,
    details,
    timestamp: new Date().toISOString()
  });
};

// User action logger middleware
const userActionLogger = (action) => {
  return (req, res, next) => {
    const originalJson = res.json;
    
    res.json = function(data) {
      // Only log successful actions (status codes 200-299)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        logger.info('User Action', {
          action,
          userId: req.user ? req.user.id : null,
          method: req.method,
          url: req.url,
          requestId: req.requestId,
          ip: req.ip || req.connection.remoteAddress,
          timestamp: new Date().toISOString()
        });
      }
      
      return originalJson.call(this, data);
    };
    
    next();
  };
};

// Database operation logger
const dbLogger = {
  create: (model, data) => {
    logger.debug('Database Create', {
      model,
      operation: 'CREATE',
      dataSize: JSON.stringify(data).length
    });
  },
  
  read: (model, query, resultCount) => {
    logger.debug('Database Read', {
      model,
      operation: 'READ',
      query: JSON.stringify(query),
      resultCount
    });
  },
  
  update: (model, query, updateData) => {
    logger.debug('Database Update', {
      model,
      operation: 'UPDATE',
      query: JSON.stringify(query),
      updateSize: JSON.stringify(updateData).length
    });
  },
  
  delete: (model, query) => {
    logger.debug('Database Delete', {
      model,
      operation: 'DELETE',
      query: JSON.stringify(query)
    });
  }
};

module.exports = {
  requestLogger,
  errorLogger,
  securityLogger,
  userActionLogger,
  dbLogger
};