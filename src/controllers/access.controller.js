"use strict";

const { SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");
const statusCodes = require("../utils/statusCodes");

class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await AccessService.handlerRefeshToken({
        refreshToken: req.refreshToken,
        user: req.decodedUser, // Shop object
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await AccessService.logout({
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  login = async (req, res, next) => {
    const { email, password } = req.body;

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await AccessService.login({
        email,
        password,
      }),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    const { name, email, password } = req.body;

    new SuccessResponse({
      statusCode: statusCodes.CREATED,
      metadata: await AccessService.signUp({
        name,
        email,
        password,
      }),
    }).send(res);
  };
}

module.exports = new AccessController();
