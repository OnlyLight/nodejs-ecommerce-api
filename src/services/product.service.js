'use strict'

const { ErrorResponse } = require("../core/error.response")
const { product, clothing, electronic } = require("../models/product.model")
const statusCodes = require("../utils/statusCodes")

class ProductFactory {
  static async createProduct(type, payload) {
    console.log("type::", type);
    console.log("payload::", payload);
    
    switch (type) {
      case "Clothing":
        return new Clothing(payload).createProduct()
      case "Electronics":
        return new Electronic(payload).createProduct()
      default:
        throw new ErrorResponse({
          message: "Invalid product type",
          statusCode: statusCodes.BAD_REQUEST
        })
    }
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

  async createProduct() {
    return await product.create(this)
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes)
    if (!newClothing) {
      throw new ErrorResponse({
        message: "Create new clothing err",
        statusCode: statusCodes.BAD_REQUEST
      })
    }

    const newProduct = await super.createProduct()
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
    const newElectronic = await electronic.create(this.product_attributes)
    if (!newElectronic) {
      throw new ErrorResponse({
        message: "Create new clothing err",
        statusCode: statusCodes.BAD_REQUEST
      })
    }

    const newProduct = await super.createProduct()
    if (!newProduct) {
      throw new ErrorResponse({
        message: "Create new clothing err",
        statusCode: statusCodes.BAD_REQUEST
      })
    }

    return newProduct
  }
}

module.exports = ProductFactory
