import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing");

  console.log("📡 Connecting to MongoDB...");

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "momento",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  console.log("✅ MongoDB connected");

  return cached.conn;}
// };
// import mongoose, { Mongoose } from "mongoose";

// const MONGODB_URL = process.env.MONGODB_URL;

// interface MongooseConnection {
//     conn: Mongoose | null;
//     promise: Promise<Mongoose> | null;
// };

// let cached: MongooseConnection = (global as any).mongoose;

// if(!cached) {
//     cached = (global as any).mongoose = {
//         conn: null, promise: null
//     }
// }

// export const connectToDB = async () => {
//     if(cached.conn) return cached.conn;

//     if(!MONGODB_URL) throw new Error('Missing MONGODB_URL');

//     cached.promise =
//         cached.promise ||
//         mongoose.connect(
//             MONGODB_URL, {
//                 dbName: "InstantAI",
//                 bufferCommands: false
//             }
//         )

//     cached.conn = await cached.promise;

//     return cached.conn;
// }