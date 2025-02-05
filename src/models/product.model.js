const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME_PRODUCT = 'Product'
const COLLECTION_NAME_PRODUCT = 'Products'
const DOCUMENT_NAME_CLOTHERS = 'Clother'
const COLLECTION_NAME_CLOTHERS = 'Clothers'
const DOCUMENT_NAME_ELECTRONIC = 'Electronic'
const COLLECTION_NAME_ELECTRONIC = 'Electronics'

// Declare the Schema of the Mongo model
const productSchema = new Schema({
  product_name: {
    type:String,
    required:true
  },
  product_thumb: {
    type: String,
    required: true
  },
  product_description: String,
  product_price: {
    type: Number,
    required: true
  },
  product_quantity: {
    type: Number,
    required: true
  },
  product_type: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Books', 'Home & Garden']
  },
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  },
  product_attributes: {
    type: Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME_PRODUCT
});

const clothingSchema = new Schema({
  brand: {
    type: String,
    required: true
  },
  size: String,
  material: String
}, {
  timestamps: true,
  collection: COLLECTION_NAME_CLOTHERS
})

const electronicSchema = new Schema({
  manufacturer: {
    type: String,
    required: true
  },
  model: String,
  color: String
}, {
  timestamps: true,
  collection: COLLECTION_NAME_ELECTRONIC
})

//Export the model
module.exports = {
  product: model(DOCUMENT_NAME_PRODUCT, productSchema),
  clothing: model(DOCUMENT_NAME_CLOTHERS, clothingSchema),
  electronic: model(DOCUMENT_NAME_ELECTRONIC, electronicSchema)
};