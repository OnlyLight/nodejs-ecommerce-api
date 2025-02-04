'use strict'

const bcrypt = require('bcrypt')

const shopModel = require("../models/shop.model")
const { generateKeyPair, createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoDta } = require("../utils")
const KeyTokenService = require("./keyToken.service")
const { ErrorResponse } = require("../core/error.response")
const { findByEmail } = require("./shop.service")
const statusCodes = require("../utils/statusCodes")

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
}

class AccessService {
  static handlerRefeshToken = async (refreshToken) => {
    // 1. validate the refresh token
    const foundKey = await KeyTokenService.findByRefreshTokenUsed(refreshToken)

    // 2. delete old key and create new key
    if (foundKey) {
      const { userId } = await verifyJWT(refreshToken, foundKey.publicKey)

      // 2.1 delete old key by userId
      await KeyTokenService.removeKeyById(userId)
      throw new ErrorResponse({ statusCode: statusCodes.FORBIDDEN, message: "Something wrong!! Pls relogin" })
    }

    // 3. find token not used in order get payload
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
    if (!holderToken) {
      throw new ErrorResponse({ statusCode: statusCodes.UNAUTHORIZED, message: "Invalid refresh token!! Shop isn't registered" })
    }

    // 4. decode payload
    const { userId, email } = await verifyJWT(refreshToken, holderToken.publicKey)
    const foundShop = await findByEmail({ email })

    if (!foundShop) {
      throw new ErrorResponse({ statusCode: statusCodes.UNAUTHORIZED, message: "Invalid refresh token!! Shop isn't registered" })
    }

    // 5. create new key
    const { privateKey, publicKey } = generateKeyPair()
    const newTokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey)

    await holderToken.update({
      $set: {
        refreshToken: newTokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: newTokens.refreshToken
      }
    })

    return {
      user: { userId, email },
      token: newTokens
    }
  }

  static logout = async({ keyStore }) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)

    console.log("delKey::", delKey)

    return {
      delKey
    }
  }

  static login = async ({email, password, refreshToken = null}) => {
    // 1. check email exist
    const foundShop = await findByEmail({ email })
    if (!foundShop) {
      throw new ErrorResponse({
        message: "Shop is not found",
        statusCode: statusCodes.BAD_REQUEST
      })
    }

    // 2. check password
    const match = bcrypt.compare(password, foundShop.password)
    if (!match) {
      throw new ErrorResponse({ statusCode: statusCodes.UNAUTHORIZED })
    }

    // // 3. create access token & refresh token => save
    const { privateKey, publicKey } = generateKeyPair()

    // 4. generate tokens
    const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey)
    console.log('tokens::', tokens)

    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      refreshToken: tokens.refreshToken,
      privateKey,  // no save privateKey it is use for testing
      publicKey
    })

    // 5. get data return login
    return {
      shop: getInfoDta({
        object: foundShop,
        fields: ["_id", "name", "email", "roles"]
      }),
      tokens
    }
  }

  static signUp = async ({name, email, password}) => {
    // shopModel.findOne({email}) => return object of mongoose
    // shopModel.findOne({email}).lean() => return object of javascript => reduce size of obj
    const holderShop = await shopModel.findOne({ email }).lean()
    if (holderShop) {
      throw new ErrorResponse({
        message: "Shop already registered",
        statusCode: statusCodes.BAD_REQUEST
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP]
    })

    if (!newShop) {
      throw new ErrorResponse({
        message: "Shop already registered",
        statusCode: statusCodes.BAD_REQUEST
      })
    }

    const { privateKey, publicKey } = generateKeyPair()

    const keyStore = await KeyTokenService.createKeyToken({
      userId: newShop._id,
      privateKey, // no save privateKey it is use for testing
      publicKey
    })

    if (!keyStore) {
      throw new ErrorResponse({
        message: "Error create key token",
        statusCode: statusCodes.BAD_REQUEST
      })
    }
    
    // // --Create Token
    const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
    console.log('Created token success::', tokens)

    return {
      shop: getInfoDta({
        object: newShop,
        fields: ["_id", "name", "email", "roles"]
      }),
      tokens
    }
  }
}

module.exports = AccessService