// import { Webhook } from 'svix'
// import { headers } from 'next/headers'
// import { WebhookEvent } from '@clerk/nextjs/server'

// export async function POST(req: Request) {
//   const SIGNING_SECRET = process.env.SIGNING_SECRET

//   if (!SIGNING_SECRET) {
//     throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
//   }

//   // Create new Svix instance with secret
//   const wh = new Webhook(SIGNING_SECRET)

//   // Get headers
//   const headerPayload = await headers()
//   const svix_id = headerPayload.get('svix-id')
//   const svix_timestamp = headerPayload.get('svix-timestamp')
//   const svix_signature = headerPayload.get('svix-signature')

//   // If there are no headers, error out
//   if (!svix_id || !svix_timestamp || !svix_signature) {
//     return new Response('Error: Missing Svix headers', {
//       status: 400,
//     })
//   }

//   // Get body
//   const payload = await req.json()
//   const body = JSON.stringify(payload)

//   let evt: WebhookEvent

//   // Verify payload with headers
//   try {
//     evt = wh.verify(body, {
//       'svix-id': svix_id,
//       'svix-timestamp': svix_timestamp,
//       'svix-signature': svix_signature,
//     }) as WebhookEvent
//   } catch (err) {
//     console.error('Error: Could not verify webhook:', err)
//     return new Response('Error: Verification error', {
//       status: 400,
//     })
//   }

//   // Do something with payload
//   // For this guide, log payload to console
//   const { id } = evt.data
//   const eventType = evt.type
//   console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
//   console.log('Webhook payload:', body)

//   return new Response('Webhook received', { status: 200 })
// }
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'

import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

import { createUser, deleteUser, updateUser } from '@/lib/actions/user.actions';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
  }
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Error: Missing Svix headers', {
      status: 400,
    })
  }

  const payload = await req.text()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new NextResponse('Invalid signature', { status: 400 });
  }


  const { id } = evt.data
  const eventType = evt.type

  if (evt.type === 'user.created') {
    console.log("Webhook received data:", req.body);

    const userInfo = evt.data;

    const user = {
      clerkId: userInfo.id,
      email: userInfo.email_addresses[0].email_address,
      username: userInfo.username ?? userInfo.first_name?.toLowerCase() ?? '',
      firstName: userInfo.first_name ?? '',
      lastName: userInfo.last_name ?? '',
      photo: userInfo.image_url,

    };
    const newUser = await createUser(user);
    if (newUser) {
      await (await clerkClient()).users.updateUserMetadata(userInfo.id, {
        publicMetadata: {
          userId: newUser._id,
        },
      });
    }
if (newUser) {
  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(userInfo.id, {
    publicMetadata: {
      userId: newUser._id,
    },
  });
}
    
    return NextResponse.json({ message: "OK", user: newUser });
  }
  if(evt.type === "user.updated"){
    const { id, image_url, first_name, last_name, username } = evt.data;

    const user = {
      firstName: first_name || '',
      lastName: last_name || '',
      username: username!,
      photo: image_url,
    };

    const updatedUser = await updateUser(id, user);

    return NextResponse.json({ message: "OK", user: updatedUser });
  }
  if (eventType === "user.deleted") {
    const { id } = evt.data;

    const deletedUser = await deleteUser(id!);

    return NextResponse.json({ message: "OK", user: deletedUser });
  }
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  return new NextResponse("", { status: 200 });
}
