"use strict";

const { SuccessResponse } = require("../core/success.response");
const statusCodes = require("../utils/statusCodes");

const dataProfiles = [
  {
    usr_id: 1,
    usr_name: "CR7",
    usr_avt: "",
  },
  {
    usr_id: 2,
    usr_name: "M10",
    usr_avt: "",
  },
];

class ProductController {
  async profiles(req, res) {
    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: dataProfiles,
    }).send(res);
  }

  async profile(req, res) {
    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: dataProfiles,
    }).send(res);
  }
}

module.exports = new ProductController();
