"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

// Declare the Schema of the Mongo model
const discountSchema = new mongoose.Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      required: true,
      enum: ["percentage", "fixed"],
    },
    discount_value: {
      type: Number,
      required: true,
    },
    discount_code: {
      type: String,
      required: true,
    },
    discount_start_date: {
      type: Date,
      required: true,
    },
    discount_end_date: {
      type: Date,
      required: true,
    },
    discount_max_use_amount: {
      // maximum amount
      type: Number,
      required: true,
    },
    discount_used_amount: {
      // how many discount amount used
      type: Number,
      required: true,
    },
    discount_users: {
      // list of users that use this discount
      type: Array,
      default: [],
    },
    discount_max_use_per_user: {
      // maximum discount amount per user
      type: Number,
      required: true,
      default: 1,
    },
    discount_min_value_to_use: {
      // minimum value to use this discount
      type: Number,
      required: true,
      default: 0,
    },
    discount_shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    discount_is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
    discount_product_applies_to: {
      type: String,
      required: true,
      enum: ["all_products", "specific_products"],
    },
    discount_product_ids: {
      // if specific_products
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, discountSchema);
