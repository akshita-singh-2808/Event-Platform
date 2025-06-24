import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: {type: String, required: true },
  photo: { type: String, required: true },
})

const User = models.User || model('User', UserSchema);

export default User;

// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   clerkId: { type: String, required: true, unique: true },
//   email: { type: String },
//   username: { type: String, required: true },
//   firstName: { type: String },
//   lastName: { type: String },
//   photo: { type: String },
// }, { timestamps: true });

// export const User = mongoose.models.User || mongoose.model("User", userSchema);
