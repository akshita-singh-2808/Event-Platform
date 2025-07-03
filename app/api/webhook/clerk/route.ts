import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/user.model';

export async function POST(req: Request) {
  const payload = await req.text(); // raw body
  const headerList = await headers(); // next/headers

  const svixId = headerList.get('svix-id');
  const svixTimestamp = headerList.get('svix-timestamp');
  const svixSignature = headerList.get('svix-signature');
  const webhookSecret = process.env.SIGNING_SECRET;

  if (!svixId || !svixTimestamp || !svixSignature || !webhookSecret) {
    return new NextResponse('Missing Svix headers or secret', { status: 400 });
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
    console.error('❌ Webhook signature verification failed:', err);
    return new NextResponse('Invalid signature', { status: 400 });
  }

  const { type, data } = evt;

  try {
    await connectToDatabase();

    if (type === 'user.created') {
      await User.create({
        clerkId: data.id,
        email: data.email_addresses[0]?.email_address,
        username: data.username || data.email_addresses[0]?.email_address?.split('@')[0],
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        photo: data.image_url,
      });

      console.log('✅ User created:', data.id);
      return NextResponse.json({ success: true });
    }

    if (type === 'user.updated') {
      await User.findOneAndUpdate(
        { clerkId: data.id },
        {
          firstName: data.first_name || '',
          lastName: data.last_name || '',
          username: data.username || '',
          photo: data.image_url,
        },
        { new: true }
      );

      console.log('✅ User updated:', data.id);
      return NextResponse.json({ success: true });
    }

    if (type === 'user.deleted') {
      await User.findOneAndDelete({ clerkId: data.id });

      console.log('🗑️ User deleted:', data.id);
      return NextResponse.json({ success: true });
    }

    console.log('⚠️ Unhandled webhook event type:', type);
    return new NextResponse('Unhandled event type', { status: 200 });
  } catch (err) {
    console.error('❌ Webhook handler error:', err);
    return new NextResponse('Server error', { status: 500 });
  }
}
