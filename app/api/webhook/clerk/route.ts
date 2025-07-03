
// app/api/webhook/clerk/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log("✅ Clerk webhook successfully hit!");
  return new NextResponse("✅ Webhook working", { status: 200 });
}
