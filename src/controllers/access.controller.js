'use strict'

const { SuccessResponse } = require("../core/success.response")
const AccessService = require("../services/access.service")
const statusCodes = require("../utils/statusCodes")

class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await AccessService.handlerRefeshToken({
        refreshToken: req.refreshToken,
        user: req.decodedUser,
        keyStore: req.keyStore
      })
    }).send(res)
  }

  logout = async (req, res, next) => {
    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await AccessService.logout(req)
    }).send(res)
  }

  login = async (req, res, next) => {
    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await AccessService.login(req.body)
    }).send(res)
  }

  signUp = async (req, res, next) => {
    new SuccessResponse({
      statusCode: statusCodes.CREATED,
      metadata: await AccessService.signUp(req.body)
    }).send(res)
  }
}

module.exports = new AccessController()