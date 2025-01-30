'use strict'

const keytokenModel = require('../models/keyToken.model')

class KeyTokenService {
  static createKeyToken = async ({ userId, refreshToken, publicKey, privateKey }) => {
    try {
      const filter = { user: userId }
      const update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken
      }
      const options = {
        upsert: true,
        new: true
      }

      const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

      return tokens ? tokens.publicKey : null
    } catch (err) {
      return err
    }
  }
}

module.exports = KeyTokenService