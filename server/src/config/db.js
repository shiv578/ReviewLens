import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  let mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/reviewlens';

  // Sanitize in case MONGODB_URI= is pasted twice into .env
  if (mongoUri.startsWith('MONGODB_URI=')) {
    mongoUri = mongoUri.replace(/^MONGODB_URI=/, '').trim();
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.warn(`[Database] Warning: MongoDB connection failed (${error.message}). The server is running, but database features will be unavailable until MongoDB is connected.`);
    return null;
  }
};

export const getDbStatus = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const stateCode = mongoose.connection.readyState;
  return {
    state: states[stateCode] || 'unknown',
    isConnected: stateCode === 1,
  };
};

export default connectDB;
