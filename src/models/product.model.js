const { Schema, model } = require('mongoose'); // Erase if already required
const { default: slugify } = require('slugify');

const DOCUMENT_NAME_PRODUCT = 'Product'
const COLLECTION_NAME_PRODUCT = 'Products'
const DOCUMENT_NAME_CLOTHERS = 'Clother'
const COLLECTION_NAME_CLOTHERS = 'Clothers'
const DOCUMENT_NAME_ELECTRONIC = 'Electronic'
const COLLECTION_NAME_ELECTRONIC = 'Electronics'
const DOCUMENT_NAME_FUNITURE = 'Funiture'
const COLLECTION_NAME_FUNITURE = 'Funitures'

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
  product_slug: String,
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
    enum: ['Electronics', 'Clothing', 'Funiture']
  },
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  },
  product_attributes: {
    type: Schema.Types.Mixed,
    required: true
  },
  product_ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be between 1 and 5'],
    max: [5, 'Rating must be between 1 and 5'],
    set: (value) => Math.round(value * 10)/10 // lam tron
  },
  product_variations: {
    type: Array,
    default: []
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
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME_PRODUCT
});

productSchema.index({ product_name: 'text', product_description: 'text' })

// Pre-save hook to automatically generate product_slug before saving and creating
productSchema.pre('save', function(next) {
  this.product_slug = slugify(this.product_name, { lower: true })
  next()
})

const clothingSchema = new Schema({
  brand: {
    type: String,
    required: true
  },
  size: String,
  material: String,
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  }
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
  color: String,
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME_ELECTRONIC
})

const funitureSchema = new Schema({
  manufacturer: {
    type: String,
    required: true
  },
  model: String,
  color: String,
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME_FUNITURE
})

//Export the model
module.exports = {
  product: model(DOCUMENT_NAME_PRODUCT, productSchema),
  clothing: model(DOCUMENT_NAME_CLOTHERS, clothingSchema),
  electronic: model(DOCUMENT_NAME_ELECTRONIC, electronicSchema),
  funiture: model(DOCUMENT_NAME_FUNITURE, funitureSchema)
};