"use strict";

const { SuccessResponse } = require("../core/success.response");
const statusCodes = require("../utils/statusCodes");
const userService = require("../services/user.service");

class UserController {
  async newUser() {
    const { email, captcha } = req.body;

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await userService.newUser({ email, captcha }),
    }).send(res);
  }

  async checkRegisterEmailToken() {}
}

module.exports = new UserController();
