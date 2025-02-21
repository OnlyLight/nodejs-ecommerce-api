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

  updateDiscount = async (req, res) => {
    const { newCode } = req.params;

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await DiscountService.updateDiscountCode({
        shopId: req.decodedUser.userId,
        code: req.params.code,
        newCode,
      }),
    }).send(res);
  };

  deleteDiscountCode = async (req, res) => {
    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await DiscountService.deleteDiscountCode({
        shopId: req.decodedUser.userId,
        code: req.params.code,
      }),
    }).send(res);
  };

  cancelDiscountCode = async (req, res) => {
    const { code, userId } = req.query;

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await DiscountService.cancelDiscountCode({
        shopId: req.decodedUser.userId,
        code,
        userId,
      }),
    }).send(res);
  };

  // QUERIES
  getAllDiscountCode = async (req, res) => {
    const { limit, page } = req.query;
    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await DiscountService.getAllDiscountCodesByShop({
        shopId: req.decodedUser.userId,
        limit,
        page,
      }),
    }).send(res);
  };

  getDiscountCodeBelongToProducts = async (req, res) => {
    const { code, limit, page } = req.query;

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await DiscountService.getAllDiscountCodesBelongToProducts({
        shopId: req.decodedUser.userId,
        code,
        limit,
        page,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res) => {
    const { code, userId } = req.query;

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await DiscountService.getDiscountAmount({
        code,
        userId,
        shopId: req.decodedUser.userId,
        products: req.body.products,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
