'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const { createTokenPair } = require("../auth/authUtils")
const { getInfoDta } = require("../utils")
const KeyTokenService = require("./keyToken.service")

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
}

class AccessService {
  static signUp = async ({name, email, password}) => {
    try {
      // shopModel.findOne({email}) => return object of mongoose
      // shopModel.findOne({email}).lean() => return object of javascript => reduce size of obj
      const holderShop = await shopModel.findOne({email}).lean()
      if (holderShop) {
        return {
          code: '50001',
          message: "Shop already registered",
          status: 'success'  
        }
      }

      const passwordHash = await bcrypt.hash(password, 10)
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP]
      })

      if (newShop) {
        // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem'
        //   },
        //   privateKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem'
        //   }
        // })

        const privateKey = crypto.randomBytes(64).toString("hex")
        const publicKey = crypto.randomBytes(64).toString("hex")

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey
        })

        if (!keyStore) {
          return {
            code: '50001',
            message: 'Error create key token',
            status: 'error'
          }
        }

        // const publicKeyObject = crypto.createPublicKey(publicKeyString)

        // --Create Token
        const tokens = await createTokenPair({ userId: newShop._id, email}, publicKey, privateKey)
        // const tokens = await createTokenPair({ userId: newShop._id, email}, publicKeyObject, privateKey)
        console.log('Created token success::', tokens)
 
        return {
          code: '20001',
          metadata: {
            shop: getInfoDta({
              object: newShop,
              fields: ["_id", "name", "email", "roles"]
            }),
            tokens
          }
        }
      }
    } catch (error) {
      return {
        code: '50001',
        message: error.message,
        status: 'error'
      }
    }
  }
}

module.exports = AccessService