"use strict";

const { ErrorResponse } = require("../core/error.response");
const inventoryModel = require("../models/inventory.model");
const { product } = require("../models/product.model");
const { findOneModelByFilter, updateModel } = require("../utils");
const statusCodes = require("../utils/statusCodes");

class InventoryService {
  static async addStockToInventory({
    inventory_productId,
    inventory_stock,
    inventory_shopId,
    invetory_location = "",
  }) {
    const foundProduct = findOneModelByFilter({
      filter: {
        _id: inventory_productId,
      },
      model: product,
    });

    if (!foundProduct) {
      throw new ErrorResponse({
        message: "Product not found",
        statusCode: statusCodes.BAD_REQUEST,
      });
    }

    const query = {
      inventory_shopId,
      inventory_productId,
    };

    const update = {
      $inc: { inventory_stock },
      $set: { invetory_location },
    };

    const options = {
      upsert: true,
      new: true,
    };

    return await updateModel({
      filter: query,
      payload: update,
      isUpsert: options.upsert,
      model: inventoryModel,
    });
  }

  static async getOrderByUser() {}
}

module.exports = InventoryService;
