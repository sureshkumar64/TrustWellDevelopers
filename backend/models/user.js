import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  uid: { type: String, required: true, unique: true }, // Firebase UID
  phone: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: false },
  loginTime: { type: Date, default: Date.now },

  // ✅ New: Store liked property IDs
  likedProperties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property'
    }
  ]
});

// Prevent OverwriteModelError in dev/hot-reload
export default mongoose.models.User || mongoose.model("User", userSchema);
