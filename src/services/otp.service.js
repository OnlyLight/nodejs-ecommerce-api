"use strict";

const { randomInt } = require("crypto");
const otpModel = require("../models/otp.model");

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
}

module.exports = new OtpService();
