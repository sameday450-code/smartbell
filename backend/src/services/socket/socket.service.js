const { Server } = require('socket.io');
const { verifyAccessToken } = require('../../utils/crypto');
const prisma = require('../../config/database');
const logger = require('../../utils/logger');

let io = null;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'https://smartbell.vercel.app',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Auth middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      if (!token) return next(new Error('Authentication required'));

      const decoded = verifyAccessToken(token);
      const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
      if (!user || !user.isActive) return next(new Error('Unauthorized'));

      socket.userId = user.id;
      socket.userRole = user.role;
      socket.schoolId = user.schoolId;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    logger.info(`Socket connected: ${socket.id} | User: ${socket.userId} | School: ${socket.schoolId}`);

    // Join school room
    if (socket.schoolId) {
      socket.join(`school:${socket.schoolId}`);
    }

    // Join role rooms
    socket.join(`role:${socket.userRole}`);

    // Device registration
    socket.on('device:register', async (data) => {
      try {
        const { deviceId } = data;
        if (deviceId && socket.schoolId) {
          await prisma.device.update({
            where: { id: deviceId },
            data: { socketId: socket.id, status: 'ONLINE', lastSeen: new Date() },
          });
          socket.deviceId = deviceId;
          socket.join(`device:${deviceId}`);
          io.to(`school:${socket.schoolId}`).emit('device:online', { deviceId, socketId: socket.id });
          logger.info(`Device registered: ${deviceId}`);
        }
      } catch (err) {
        logger.error('Device register error:', err.message);
      }
    });

    // Announcement acknowledged
    socket.on('announcement:ack', async (data) => {
      const { announcementId } = data;
      if (announcementId && socket.schoolId) {
        io.to(`school:${socket.schoolId}`).emit('announcement:ack', {
          announcementId,
          deviceId: socket.deviceId,
          socketId: socket.id,
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      logger.info(`Socket disconnected: ${socket.id}`);
      if (socket.deviceId) {
        try {
          await prisma.device.update({
            where: { id: socket.deviceId },
            data: { status: 'OFFLINE', lastSeen: new Date(), socketId: null },
          });
          if (socket.schoolId) {
            io.to(`school:${socket.schoolId}`).emit('device:offline', { deviceId: socket.deviceId });
          }
        } catch (err) {
          logger.error('Device disconnect update error:', err.message);
        }
      }
    });
  });

  logger.info('Socket.IO initialized');
  return io;
};

const getSocketService = () => ({
  io,
  broadcastToSchool: (schoolId, event, data) => {
    if (io) io.to(`school:${schoolId}`).emit(event, data);
  },
  broadcastToAll: (event, data) => {
    if (io) io.emit(event, data);
  },
  broadcastToDevice: (deviceId, event, data) => {
    if (io) io.to(`device:${deviceId}`).emit(event, data);
  },
  getOnlineDeviceCount: async (schoolId) => {
    if (!io) return 0;
    const room = io.sockets.adapter.rooms.get(`school:${schoolId}`);
    return room ? room.size : 0;
  },
});

module.exports = { initSocket, getSocketService };
