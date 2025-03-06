"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

// Declare the Schema of the Mongo model
const orderSchema = new mongoose.Schema(
  {
    order_userId: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "User",
      type: Number,
      required: true,
    },
    order_checkout: {
      type: Object,
      default: {},
    },
    order_shipping: {
      type: Object,
      default: {},
    },
    order_payment: {
      type: Object,
      default: {},
    },
    order_products: {
      type: Array,
      required: true,
    },
    order_tracking: {
      type: String,
      default: "#010010",
    },
    order_status: {
      type: String,
      required: true,
      enum: [
        "pending",
        "processing",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, orderSchema);
