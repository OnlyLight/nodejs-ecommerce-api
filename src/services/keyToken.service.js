'use strict'

const { Types } = require('mongoose')
const keytokenModel = require('../models/keyToken.model')

class KeyTokenService {
  static createKeyToken = async ({ userId, refreshToken, publicKey, privateKey }) => {
    try {
      const filter = { user: Types.ObjectId(userId) }
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

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: Types.ObjectId(userId) }).lean()
  }

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne({
      user: Types.ObjectId(id)
    })
  }

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
  }

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken }).lean()
  }
}

module.exports = KeyTokenService