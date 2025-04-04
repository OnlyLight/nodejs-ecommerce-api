"use strict";

const { ErrorResponse } = require("../core/error.response");
const userModel = require("../models/otp.model");
const { findOneModelByFilter } = require("../utils");
const statusCodes = require("../utils/statusCodes");
const { sendEmailToken } = require("./email.service");
const { checkEmailToken } = require("./otp.service");

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

  async checkLoginEmailTokenService({ token }) {
    try {
      const { otp_email, otp_token } = await checkEmailToken({ token });

      if (!otp_token) {
        throw new ErrorResponse({
          message: "Invalid token",
          statusCode: statusCodes.UNAUTHORIZED,
        });
      }

      const hadUser = await this.findUserByEmailWithLogin({ email: otp_email });

      if (hadUser) {
        throw new ErrorResponse({
          message: "User already exists",
          statusCode: statusCodes.CONFLICT,
        });
      }

      // CREate new user
    } catch (error) {
      console.error(error);
    }
  }

  async findUserByEmailWithLogin({ email }) {
    const user = await findOneModelByFilter({
      model: userModel,
      filter: { usr_email: email },
    });

    if (!user) {
      throw new ErrorResponse({
        message: "User not found",
        statusCode: statusCodes.NOT_FOUND,
      });
    }

    return user;
  }
}

module.exports = new UserService();
