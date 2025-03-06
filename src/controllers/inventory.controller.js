"use strict";

const { SuccessResponse } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");
const statusCodes = require("../utils/statusCodes");

class InventoryController {
  addStock = async (req, res, next) => {
    const {
      inventory_productId,
      inventory_stock,
      inventory_shopId,
      invetory_location,
    } = req.body;

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await InventoryService.addStockToInventory({
        inventory_productId,
        inventory_stock,
        inventory_shopId,
        invetory_location,
      }),
    }).send(res);
  };
}

module.exports = new InventoryController();
