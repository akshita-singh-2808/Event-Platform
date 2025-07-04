import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  photo: { type: String, required: true },
}, {
  timestamps: true  // ✅ Adds createdAt and updatedAt
});

// Optional: improve query speed
// UserSchema.index({ clerkId: 1 });

const User = models.User || model('User', UserSchema);

export default User;
