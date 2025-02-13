"use strict";

const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");
const statusCodes = require("../utils/statusCodes");

class DiscountController {
  createDiscount = async (req, res, next) => {
    new SuccessResponse({
      statusCode: statusCodes.CREATED,
      metadata: await DiscountService.createDiscountCode({
        shopId: req.decodedUser.userId,
        payload: req.body,
      }),
    }).send(res);
  };

  getAllDiscountCode = async (req, res) => {
    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await DiscountService.getAllDiscountCodesByShop({
        shopId: req.decodedUser.userId,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
