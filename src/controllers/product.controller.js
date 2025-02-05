'use strict'

const ProductFactory = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      statusCode: statusCodes.CREATED,
      metadata: await ProductFactory.createProduct(req.body.product_type, req.body)
    }).send(res)
  }
}

module.exports = new ProductController();
