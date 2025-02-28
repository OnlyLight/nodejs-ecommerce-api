"use strict";

const { SuccessResponse } = require("../core/success.response");
const { checkoutReview } = require("../services/checkout.service");
const statusCodes = require("../utils/statusCodes");

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await checkoutReview({
        cartId: req.query.cartId,
        userId: req.query.userId,
        products: req.body.products,
      }),
    }).send(res);
  };
}

module.exports = new CheckoutController();
