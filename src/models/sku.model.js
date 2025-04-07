const { Schema, model } = require("mongoose"); // Erase if already required
const { default: slugify } = require("slugify");

const DOCUMENT_NAME_SKU = "Sku";
const COLLECTION_NAME_SKU = "Skus";

// Declare the Schema of the Mongo model
const skuSchema = new Schema(
  {
    sku_id: { type: String, required: true, unique: true },
    sku_tier_idx: { type: Array, default: [0], required: true },
    /**
     * color: ["red", "green", "blue"]
     * size: ["S", "M", "L"]
     * ==> ["red", "S"]: [0, 0]
     * ==> ["green", "L"]: [1, 2]
     */
    sku_default: { type: Boolean, default: false },
    sku_slug: { type: String, default: "" },
    sku_sort: { type: Number, default: 0 },
    sku_price: { type: String, required: true },
    sku_stock: { type: Number, default: 0 },
    product_id: { type: String, required: true },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublish: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME_SKU,
  }
);

//Export the model
module.exports = {
  product: model(DOCUMENT_NAME_SKU, skuSchema),
};
