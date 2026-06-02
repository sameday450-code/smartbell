require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { initSocket } = require('./src/services/socket/socket.service');
const { initCronJobs } = require('./src/services/scheduler/scheduler.service');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.IO — runs in both local and Vercel environments.
// On Vercel, clients should use transports: ['polling'] as WebSocket
// persistence across serverless invocations is not guaranteed.
initSocket(server);

if (!process.env.VERCEL) {
  // Traditional server: start node-cron and listen on PORT
  initCronJobs();

  server.listen(PORT, () => {
    logger.info(`SmartBell server running on port ${PORT} [${process.env.NODE_ENV}]`);
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      logger.info('Process terminated.');
      process.exit(0);
    });
  });

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:', reason);
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
  });
}

// Export the Express app for Vercel's serverless runtime.
// Vercel requires a request handler function, not an http.Server instance.
// Socket.IO polling will still work via the app's underlying routes.
module.exports = app;
