import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers(); // ✅ await is necessary in App Router

  const svixId = headerList.get('svix-id');
  const svixTimestamp = headerList.get('svix-timestamp');
  const svixSignature = headerList.get('svix-signature');

  console.log("✅ Webhook reached");
  console.log("🧠 Headers:", {
    'svix-id': svixId,
    'svix-timestamp': svixTimestamp,
    'svix-signature': svixSignature,
  });
  console.log("📦 Raw Payload:", body);

  return NextResponse.json({ message: "Webhook received" });
}
