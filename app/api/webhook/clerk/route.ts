// app/api/webhook/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import User from '@/lib/database/models/user.model';
import { connectToDatabase } from '@/lib/database';

export async function POST(req: Request) {
  const payload = await req.text();
  const headerList = await headers(); // ✅ no await

  const svixId = headerList.get('svix-id');
  const svixTimestamp = headerList.get('svix-timestamp');
  const svixSignature = headerList.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new NextResponse('Missing Svix headers', { status: 400 });
  }

  const webhookSecret = process.env.SIGNING_SECRET;
  if (!webhookSecret) {
    return new NextResponse('Missing SIGNING_SECRET', { status: 500 });
  }

  const wh = new Webhook(webhookSecret);
  let evt: { type: string; data: any };

  try {
    evt = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as { type: string; data: any };
  } catch (err) {
    console.error('❌ Webhook verification failed:', err);
    return new NextResponse('Invalid signature', { status: 400 });
  }

  const { type, data } = evt;

  if (type === 'user.created') {
    try {
      await connectToDatabase();

      await User.create({
        clerkId: data.id,
        email: data.email_addresses[0]?.email_address,
        username: data.username || data.email_addresses[0]?.email_address.split('@')[0],
        firstName: data.first_name,
        lastName: data.last_name,
        photo: data.image_url,
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('❌ Mongo insert failed:', error);
      return new NextResponse('Failed to insert user', { status: 500 });
    }
  }

  return new NextResponse('Event not handled', { status: 200 });
}
