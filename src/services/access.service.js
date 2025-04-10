"use strict";

const bcrypt = require("bcrypt");

const shopModel = require("../models/shop.model");
const { generateKeyPair, createTokenPair } = require("../auth/authUtils");
const { getInfoDta, updateModel } = require("../utils");
const KeyTokenService = require("./keyToken.service");
const { ErrorResponse } = require("../core/error.response");
const { findByEmail } = require("../repositories/shop.repo");
const statusCodes = require("../utils/statusCodes");
const keyTokenModel = require("../models/keyToken.model");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static handlerRefeshToken = async ({ refreshToken, user, keyStore }) => {
    if (!user || !keyStore) {
      throw new ErrorResponse({
        statusCode: statusCodes.INTERNAL_SERVER_ERROR,
        message: "Something wrong!! Pls relogin",
      });
    }

    // Shop object
    const { userId, email } = user;

    // 1. validate the refresh token
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      // 2. delete old key
      await KeyTokenService.removeKeyById(userId);
      throw new ErrorResponse({
        statusCode: statusCodes.FORBIDDEN,
        message: "Something wrong!! Pls relogin",
      });
    }

    // 3. find token not used in order get payload
    if (keyStore.refreshToken != refreshToken) {
      throw new ErrorResponse({
        statusCode: statusCodes.UNAUTHORIZED,
        message: "Invalid refresh token!! Shop isn't registered",
      });
    }

    const foundShop = await findByEmail({ email });

    if (!foundShop) {
      throw new ErrorResponse({
        statusCode: statusCodes.UNAUTHORIZED,
        message: "Invalid refresh token!! Shop isn't registered",
      });
    }

    // 5. create new key
    const { privateKey, publicKey } = generateKeyPair();
    const newTokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );

    const rs = await updateModel({
      filter: { _id: keyStore._id },
      payload: {
        $set: { refreshToken: newTokens.refreshToken },
        $addToSet: { refreshTokensUsed: refreshToken },
      },
      model: keyTokenModel,
    });
    // const result = await keyTokenModel.findOneAndUpdate(
    //   { _id: keyStore._id },
    //   {
    //     $set: { refreshToken: newTokens.refreshToken },
    //     $addToSet: { refreshTokensUsed: refreshToken },
    //   },
    //   { new: true }
    // );

    return {
      user: { userId, email },
      token: newTokens,
    };
  };

  static logout = async ({ keyStore }) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore.user);

    console.log("keyStore.user::", keyStore.user);
    console.log("delKey::", delKey);

    return {
      delKey,
    };
  };

  static login = async ({ email, password, refreshToken = null }) => {
    // 1. check email exist
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new ErrorResponse({
        message: "Shop is not found",
        statusCode: statusCodes.BAD_REQUEST,
      });
    }

    // 2. check password
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new ErrorResponse({ statusCode: statusCodes.UNAUTHORIZED });
    }

    // // 3. create access token & refresh token => save
    const { privateKey, publicKey } = generateKeyPair();

    // 4. generate tokens
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );
    console.log("tokens::", tokens);

    await KeyTokenService.createKeyToken({
      userId: foundShop._id, // shop ID
      refreshToken: tokens.refreshToken,
      privateKey, // no save privateKey it is use for testing
      publicKey,
    });

    // 5. get data return login
    return {
      shop: getInfoDta({
        object: foundShop,
        fields: ["_id", "name", "email", "roles"],
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // shopModel.findOne({email}) => return object of mongoose
    // shopModel.findOne({email}).lean() => return object of javascript => reduce size of obj
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new ErrorResponse({
        message: "Shop already registered",
        statusCode: statusCodes.BAD_REQUEST,
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (!newShop) {
      throw new ErrorResponse({
        message: "Shop already registered",
        statusCode: statusCodes.BAD_REQUEST,
      });
    }

    const { privateKey, publicKey } = generateKeyPair();

    const keyStore = await KeyTokenService.createKeyToken({
      userId: newShop._id, // shop ID
      privateKey, // no save privateKey it is use for testing
      publicKey,
    });

    if (!keyStore) {
      throw new ErrorResponse({
        message: "Error create key token",
        statusCode: statusCodes.BAD_REQUEST,
      });
    }

    // // --Create Token
    const tokens = await createTokenPair(
      { userId: newShop._id, email },
      publicKey,
      privateKey
    );
    console.log("Created token success::", tokens);

    return {
      shop: getInfoDta({
        object: newShop,
        fields: ["_id", "name", "email", "roles"],
      }),
      tokens,
    };
  };
}

module.exports = AccessService;
