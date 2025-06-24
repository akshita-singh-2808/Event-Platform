import { NextResponse } from 'next/server'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.actions'
import clerkClient from '@clerk/clerk-sdk-node'

export async function POST(req: Request) {
  const payload = (await req.json()) as WebhookEvent
  const evt = payload
  const { id } = evt.data

  if (!id) {
    return new Response('Missing Clerk user ID', { status: 400 })
  }

  const eventType = evt.type

  if (eventType === 'user.created') {
    const { email_addresses, image_url, first_name, last_name, username } = evt.data

    const user = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username ?? email_addresses[0].email_address.split('@')[0],
      firstName: first_name ?? '',
      lastName: last_name ?? '',
      photo: image_url,
    }

    const newUser = await createUser(user)

    if (newUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id,
        },
      })
    }

    return NextResponse.json({ message: 'OK', user: newUser })
  }

  if (eventType === 'user.updated') {
    const { image_url, first_name, last_name, username } = evt.data

    const user = {
      firstName: first_name ?? '',
      lastName: last_name ?? '',
      username: username!,
      photo: image_url,
    }

    const updatedUser = await updateUser(id, user)
    return NextResponse.json({ message: 'OK', user: updatedUser })
  }

  if (eventType === 'user.deleted') {
    const deletedUser = await deleteUser(id!)
    return NextResponse.json({ message: 'OK', user: deletedUser })
  }

  return new Response('', { status: 200 })
}
