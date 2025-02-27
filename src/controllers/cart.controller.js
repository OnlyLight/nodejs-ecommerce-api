"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
  addToCart,
  getListCart,
  deleteItemInCart,
} = require("../services/cart.service");
const statusCodes = require("../utils/statusCodes");

class CartController {
  createCart = async (req, res) => {
    const { userId, product } = req.body;

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await addToCart({ userId, product }),
    }).send(res);
  };

  deleteItemInCart = async (req, res) => {
    const { userId } = req.params;
    const { productId } = req.query;

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await deleteItemInCart({ userId, productId }),
    }).send(res);
  };

  getListCart = async (req, res) => {
    const { userId } = req.params;

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await getListCart({ userId }),
    }).send(res);
  };
}

module.exports = new CartController();
