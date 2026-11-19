import { getDbStatus } from '../config/db.js';

export const getHealth = (req, res) => {
  const dbStatus = getDbStatus();

  res.status(200).json({
    status: 'ok',
    message: 'ReviewLens Backend API is operational',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStatus.state,
      connected: dbStatus.isConnected,
    },
    version: '0.1.0',
  });
};
