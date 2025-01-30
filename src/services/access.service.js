'use strict'

const bcrypt = require('bcrypt')

const shopModel = require("../models/shop.model")
const { generateKeyPair, createTokenPair } = require("../auth/authUtils")
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