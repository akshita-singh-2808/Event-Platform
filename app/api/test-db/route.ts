import { connectToDatabase } from '@/lib/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const db = await connectToDatabase(); // this returns the mongoose connection
    const dbName = db.connection.name; // get the database name like 'Mymomento'

    return NextResponse.json({
      success: true,
     message: `Connected to DB: ${dbName} ✅`,

    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'DB connection failed ❌',
    });
  }
}