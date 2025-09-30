/**
 * Global error handling middleware
 * Catches and formats all application errors
 */
const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';
  
  // Log error details
  console.error('🔥 Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors).map(err => err.message).join(', ');
  }
  
  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }
  
  if (error.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }
  
  // PostgreSQL specific errors
  if (error.code === '23505') { // Unique constraint violation
    statusCode = 400;
    message = 'Resource already exists';
  }
  
  if (error.code === '23503') { // Foreign key constraint violation
    statusCode = 400;
    message = 'Referenced resource does not exist';
  }
  
  if (error.code === '22001') { // String data too long
    statusCode = 400;
    message = 'Input data too long';
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Something went wrong on our end';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack,
      error: error 
    })
  });
};

export default errorHandler;