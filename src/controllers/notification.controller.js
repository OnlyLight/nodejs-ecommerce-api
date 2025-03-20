"use strict";

const { SuccessResponse } = require("../core/success.response");
const { getNotiByUserId } = require("../services/notification.service");
const statusCodes = require("../utils/statusCodes");

class NotificationController {
  async getNotiByUserId(res, req) {
    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await getNotiByUserId({
        userId: req.query.userId,
        type: req.query.type,
      }),
    }).send(res);
  }
}

module.exports = new NotificationController();
