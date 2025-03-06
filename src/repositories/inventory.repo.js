"use strict";

const { Types } = require("mongoose");
const inventoryModel = require("../models/inventory.model");
const { $where } = require("../models/cart.model");
const { updateModel } = require("../utils");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknow",
}) => {
  return await inventoryModel.create({
    inventory_productId: productId,
    inventory_shopId: shopId,
    inventory_stock: stock,
    inventory_location: location,
  });
};

const reservationInventory = async ({ productId, productQuantity, cartId }) => {
  const query = {
    inventory_productId: new Types.ObjectId(productId),
    inventory_stock: { $gte: productQuantity },
  };

  const update = {
    $inc: {
      inventory_stock: -productQuantity,
    },
    $push: {
      inventory_reservations: {
        cart_id: cartId,
        product_quantity: productQuantity,
        created_at: new Date(),
      },
    },
  };

  const options = {
    new: true,
    upsert: true,
  };

  return await updateModel({
    filter: query,
    payload: update,
    isUpsert: options.upsert,
    model: inventoryModel,
  });
};

module.exports = {
  insertInventory,
  reservationInventory,
};
