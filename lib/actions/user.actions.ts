'use server'

import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '@/lib/database'
import User from '@/lib/database/models/user.model'
import Order from '@/lib/database/models/order.model'
import Event from '@/lib/database/models/event.model'
import { handleError } from '@/lib/utils'

import { CreateUserParams, UpdateUserParams } from '@/types'

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase()

    const existingUser = await User.findOne({ clerkId: user.clerkId })
    if (existingUser) {
      console.log('⚠️ User already exists:', existingUser.email)
      return JSON.parse(JSON.stringify(existingUser))
    }

    const newUser = await User.create(user)
    console.log('✅ New user created:', newUser.email)

    return JSON.parse(JSON.stringify(newUser))
  } catch (error) {
    console.error('❌ Error in createUser:', error)
    handleError(error)
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase()

    const user = await User.findById(userId)
    if (!user) throw new Error('User not found')

    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    console.error('❌ Error in getUserById:', error)
    handleError(error)
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase()

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true })

    if (!updatedUser) throw new Error('User update failed')

    console.log('🔁 User updated:', updatedUser.email)
    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error) {
    console.error('❌ Error in updateUser:', error)
    handleError(error)
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase()

    const userToDelete = await User.findOne({ clerkId })

    if (!userToDelete) throw new Error('User not found')

    await Promise.all([
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),
      Order.updateMany({ _id: { $in: userToDelete.orders } }, { $unset: { buyer: 1 } }),
    ])

    const deletedUser = await User.findByIdAndDelete(userToDelete._id)
    revalidatePath('/')

    console.log('🗑️ User deleted:', deletedUser?.email)
    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
  } catch (error) {
    console.error('❌ Error in deleteUser:', error)
    handleError(error)
  }
}
