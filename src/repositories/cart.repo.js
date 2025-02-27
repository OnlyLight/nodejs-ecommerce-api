"use strict";

const cartModel = require("../models/cart.model");
const { updateModel } = require("../utils");

const createUserCart = async ({ userId, product }) => {
  const query = {
    cart_userId: userId,
    cart_state: "active",
  };

  const update = {
    $addToSet: {
      cart_products: product,
    },
  };

  const options = {
    upsert: true, // If the document exists, it will be updated. If the document does not exist, a new one will be inserted.
    new: true, // Returns the updated document instead of the old one.
  };

  return await updateModel({
    filter: query,
    payload: update,
    isUpsert: options.upsert,
    model: cartModel,
  });
};

const updateUserCartQuantity = async ({ userId, product }) => {
  const { product_id, product_quantity } = product;

  const query = {
    cart_userId: userId,
    "cart_products.product_id": product_id,
    cart_state: "active",
  };

  const update = {
    // $in: positive number will + (increasing value) || negative number will - (decreasing value)
    $inc: {
      // $: meaning update product related to cartfound from query command
      "cart_products.$.product_quantity": product_quantity,
    },
  };

  const options = {
    upsert: true, // If the document exists, it will be updated. If the document does not exist, a new one will be inserted.
    new: true, // Returns the updated document instead of the old one.
  };

  return await updateModel({
    filter: query,
    payload: update,
    isUpsert: options.upsert,
    model: cartModel,
  });
};

module.exports = {
  createUserCart,
  updateUserCartQuantity,
};
