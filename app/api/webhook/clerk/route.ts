import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const rawBody = await req.text();
  const headerList = await headers();

  const svixId = headerList.get('svix-id');
  const svixTimestamp = headerList.get('svix-timestamp');
  const svixSignature = headerList.get('svix-signature');

  console.log("✅ Webhook reached!");
  console.log("🔐 Headers:", { svixId, svixTimestamp, svixSignature });
  console.log("📦 Raw Body:", rawBody);

  return NextResponse.json({ status: 'received', headers: { svixId, svixTimestamp, svixSignature } });
}
