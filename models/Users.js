// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String }, // Not required for Google-authenticated users
    googleAuthId: { type: String, unique: true, sparse: true }, // Only for Google auth
    bloodType: { type: String },
    emergencyContacts: [{ name: String, phone: String }],
    address: { type: String },
    profilePicture: { type: String }, // URL to profile picture
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
