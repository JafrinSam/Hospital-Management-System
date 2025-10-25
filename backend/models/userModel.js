// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // ✅ Basic info
  name: {
    type: String,
    required: [true, "Name is required."],
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    sparse: true,
  },
  phone: {
    type: String,
    unique: true,
    required: [true, "Phone number is required."],
    validate: {
      validator: (v) => /^[6-9]\d{9}$/.test(v),
      message: (props) =>
        `${props.value} is not a valid 10-digit Indian mobile number!`,
    },
    set: function (v) {
      if (v && v.startsWith("+91")) return v.substring(3);
      if (v && v.length === 12 && v.startsWith("91")) return v.substring(2);
      return v;
    },
  },

  // ✅ Role and Demographics
  role: {
    type: String,
    enum: ["Patient", "Doctor", "Nurse", "Staff", "Admin"],
    required: true,
    default: "Patient",
  },
  sex: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  age: {
    type: Number,
    min: 0,
  },
  occupation: {
    type: String,
    trim: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: {
      type: String,
      match: /^[1-9][0-9]{5}$/,
    },
  },

  // ✅ Security & Device Identity
  publicKey: {
    type: String,
    required: false, // optional for hospital users
  },
  device: {
    deviceId: { type: String },
    deviceName: String,
    lastSeen: Date,
    lastIP: String,
    pushToken: String,
    addedAt: { type: Date, default: Date.now },
  },

  // ✅ Contact/Relationship Graph (for communication modules)
  allowedContacts: [
    {
      contactId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      type: {
        type: String,
        enum: ["Group", "Contact"],
        default: "Contact",
      },
      alias: String,
      lastVerifiedAt: { type: Date, default: Date.now },
      addedAt: { type: Date, default: Date.now },
    },
  ],

  // ✅ Meta Info
  createdAt: { type: Date, default: Date.now },
});

// 🧩 Virtual populate: auto-populate contact info
UserSchema.virtual("allowedContactsInfo", {
  ref: "User",
  localField: "allowedContacts.contactId",
  foreignField: "_id",
  justOne: false,
  select: "publicKey phone role name",
});

// Ensure virtuals appear in JSON/object conversions
UserSchema.set("toJSON", { virtuals: true });
UserSchema.set("toObject", { virtuals: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;
