"use strict";

const { ErrorResponse } = require("../core/error.response");
const userModel = require("../models/otp.model");
const { findOneModelByFilter } = require("../utils");
const statusCodes = require("../utils/statusCodes");
const { sendEmailToken } = require("./email.service");

class UserService {
  async newUser({ email, captcha }) {
    const user = await findOneModelByFilter({
      model: userModel,
      filter: { email },
    });

    if (user) {
      throw new ErrorResponse({
        message: "User already exists",
        statusCode: statusCodes.CONFLICT,
      });
    }

    const result = await sendEmailToken({ email });

    return result;
  }
}

module.exports = new UserService();
