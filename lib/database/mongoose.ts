import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error('❌ Missing MONGODB_URL in environment variables');
}

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// @ts-ignore - used for hot reload cache on Next.js dev
let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async (): Promise<Mongoose> => {
  if (cached.conn) {
    return cached.conn;
  }

  console.log('📡 Connecting to MongoDB...');

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: 'momento', // ✅ Your DB name
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  console.log('✅ MongoDB connected');
  return cached.conn;
};
