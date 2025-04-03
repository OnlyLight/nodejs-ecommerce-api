"use strict";

const { SuccessResponse } = require("../core/success.response");
const templateService = require("../services/template.service");
const statusCodes = require("../utils/statusCodes");

class InventoryController {
  newTemplate = async (req, res, next) => {
    const { tem_name } = req.body;

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: templateService.newTemplate({ tem_name }),
    }).send(res);
  };
}

module.exports = new InventoryController();
