const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log after response is sent
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const log = `${new Date().toISOString()} | ${req.method} ${req.path} | Status: ${res.statusCode} | ${duration}ms | IP: ${req.ip}\n`;
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(log.trim());
    }
    
    // Log to file
    fs.appendFileSync(
      path.join(logsDir, `api-${new Date().toISOString().split('T')[0]}.log`),
      log
    );
  });
  
  next();
};

module.exports = requestLogger;
