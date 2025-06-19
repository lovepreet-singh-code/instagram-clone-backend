// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// export interface IUser extends Document {
//   username: string;
//   email: string;
//   password: string;
//   bio?: string;
//   avatar?: string;
//   followers: mongoose.Types.ObjectId[];
//   following: mongoose.Types.ObjectId[];
//   comparePassword(candidatePassword: string): Promise<boolean>; // ✅ Add method
// }

// const userSchema = new mongoose.Schema(
//   {
//     username: { type: String, required: true, unique: true },
//     email:    { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     bio:      { type: String },
//     avatar:   { type: String },
//     followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//     following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   },
//   { timestamps: true }
// );

// userSchema.pre('save', async function () {
//   if (!this.isModified('password')) return;
//   this.password = await bcrypt.hash(this.password, 10);
// });

// userSchema.methods.comparePassword = async function (candidatePassword: string) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// export const User = mongoose.model('User', userSchema);


import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// 👇 1. Custom interface for User methods & fields
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 👇 2. Define schema with type hint <IUser>
const userSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio:      { type: String },
    avatar:   { type: String },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// 👇 3. Hash password before save
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 👇 4. Add custom method
userSchema.methods.comparePassword = async function (
  this: IUser,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 👇 5. Export the typed model
export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
