"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "OTP";
const COLLECTION_NAME = "OTPs";

// Declare the Schema of the Mongo model
const otpSchema = new mongoose.Schema(
  {
    otp_email: { type: String, required: true },
    otp_token: { type: String, required: true },
    otp_status: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "block"],
    },
    expireAt: { type: Date, default: Date.now(), expires: 60 },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, otpSchema);
