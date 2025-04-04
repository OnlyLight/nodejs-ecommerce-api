"use strict";

const { randomInt } = require("crypto");
const otpModel = require("../models/otp.model");
const { findOneModelByFilter } = require("../utils");
const { ErrorResponse } = require("../core/error.response");
const statusCodes = require("../utils/statusCodes");

class OtpService {
  generatorTokenRandom() {
    const token = randomInt(0, Math.pow(2, 32));

    return token;
  }

  async newOTP({ email }) {
    const token = this.generatorTokenRandom();
    const newToken = await otpModel.create({
      otp_token: token,
      otp_email: email,
    });

    return newToken;
  }

  async checkEmailToken({ toekn }) {
    const token = await findOneModelByFilter({
      model: otpModel,
      filter: { otp_token: token },
    });

    if (!token) {
      throw new ErrorResponse({
        message: "Token not found",
        statusCode: statusCodes.NOT_FOUND,
      });
    }

    await otpModel.deleteOne({ otp_token: token });

    return token;
  }
}

module.exports = new OtpService();
