"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

// Declare the Schema of the Mongo model
const notificationSchema = new mongoose.Schema(
  {
    /**
     * ORDER-001: order successfully
     * ORDER-002: order failed
     * PROMOTION-001: new promotion
     * SHOP-001: new product by user following
     */
    noti_type: {
      type: String,
      required: true,
      enum: ["ORDER-001", "ORDER-002", "PROMOTION-001", "SHOP-001"],
    },
    noti_senderId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    noti_receiveId: {
      type: Number,
      required: true,
    },
    noti_content: {
      type: String,
      required: true,
    },
    noti_options: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, notificationSchema);
