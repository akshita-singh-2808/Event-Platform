import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true }, // ← optional
  firstName: { type: String },              // ← optional
  lastName: { type: String },               // ← optional
  photo: { type: String, required: true },
});

const User = models.User || model('User', UserSchema);

export default User;
