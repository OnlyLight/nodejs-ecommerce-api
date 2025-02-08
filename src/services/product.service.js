'use strict'

const { ErrorResponse } = require("../core/error.response")
const { product, clothing, electronic } = require("../models/product.model")
const { findAllDraftsForShop, publishProductByShop, findAllPublishForShop, unpublishProductByShop, searchProductByUser } = require("../repositories/product.repo")
const statusCodes = require("../utils/statusCodes")

class ProductFactory {
  static productRegistry = {}

  static registerRegistry(type, classRef) {
    ProductFactory.productRegistry[type] = classRef
  }

  static async createProduct(type, payload) {
    console.log("type::", type);
    console.log("payload::", payload);

    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new ErrorResponse({
        message: `Invalid product type: ${type}`,
        statusCode: statusCodes.BAD_REQUEST
      })
    }

    return new productClass(payload).createProduct()
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id })
  }
  
  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unpublishProductByShop({ product_shop, product_id })
  }


  /// Queries
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    return await findAllDraftsForShop({
      query: { product_shop, isDraft: true },
      limit,
      skip
    })
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    return await findAllPublishForShop({
      query: { product_shop, isPublish: true },
      limit,
      skip
    })
  }

  static async getListSearchProducts({ keySearch }) {
    return await searchProductByUser({ keySearch })
  }
}

class Product {
  constructor({ product_name, product_thumb, product_description, product_price, product_type, product_shop, product_attributes, product_quantity }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
    this.product_quantity = product_quantity
  }

  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id })
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newClothing) {
      throw new ErrorResponse({
        message: "Create new clothing err",
        statusCode: statusCodes.BAD_REQUEST
      })
    }

    const newProduct = await super.createProduct(newClothing._id)
    if (!newProduct) {
      throw new ErrorResponse({
        message: "Create new clothing err",
        statusCode: statusCodes.BAD_REQUEST
      })
    }

    return newProduct
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newElectronic) {
      throw new ErrorResponse({
        message: "Create new clothing err",
        statusCode: statusCodes.BAD_REQUEST
      })
    }

    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) {
      throw new ErrorResponse({
        message: "Create new clothing err",
        statusCode: statusCodes.BAD_REQUEST
      })
    }

    return newProduct
  }
}

ProductFactory.registerRegistry("Clothing", Clothing)
ProductFactory.registerRegistry("Electronics", Electronic)

module.exports = ProductFactory
