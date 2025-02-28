"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
  addToCart,
  getListCart,
  deleteItemInCart,
  updateCart,
} = require("../services/cart.service");
const statusCodes = require("../utils/statusCodes");

class CartController {
  initialCart = async (req, res) => {
    const { userId, product } = req.body;

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await addToCart({ userId, product }),
    }).send(res);
  };

  updateCart = async (req, res) => {
    const { userId } = req.params;
    const { products } = req.body;

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await updateCart({ userId, products }),
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
