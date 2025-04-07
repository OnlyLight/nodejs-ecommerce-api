const { Schema, model } = require("mongoose"); // Erase if already required
const { default: slugify } = require("slugify");

const DOCUMENT_NAME_SPU = "Spu";
const COLLECTION_NAME_SPU = "Spus";

// Declare the Schema of the Mongo model
const spuSchema = new Schema(
  {
    product_id: { type: String, required: true, default: "" },
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: String,
    product_slug: String,
    product_price: {
      type: Number,
      required: true,
    },
    product_category: {
      type: Array,
      default: [],
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    /**
     * tier_variation: [
     *  {
     *    name: "color",
     *    images: [],
     *    options: ["red", "green", "blue"]
     *  },
     *  {
     *    name: "size",
     *    images: [],
     *    options: ["S", "M", "L"]
     *  }
     * ]
     */
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be between 1 and 5"],
      max: [5, "Rating must be between 1 and 5"],
      set: (value) => Math.round(value * 10) / 10, // lam tron
    },
    product_variations: {
      type: Array,
      default: [],
    },
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
    isDeleted: { type: Boolean, default: false, index: true, select: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME_SPU,
  }
);

spuSchema.index({ product_name: "text", product_description: "text" });

// Pre-save hook to automatically generate product_slug before saving and creating
spuSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

//Export the model
module.exports = {
  product: model(DOCUMENT_NAME_SPU, spuSchema),
};
