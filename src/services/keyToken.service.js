'use strict'

const { Types } = require('mongoose')
const keytokenModel = require('../models/keyToken.model')
const { updateModel } = require('../utils')

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
        upsert: true, // If the document exists, it will be updated. If the document does not exist, a new one will be inserted.
        new: true // Returns the updated document instead of the old one.
      }

      const tokens = await updateModel({
        filter,
        payload: update,
        isUpsert: options.upsert,
        model: keytokenModel
      })
      // const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

      return tokens ? tokens.publicKey : null
    } catch (err) {
      return err
    }
  }

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: userId })
  }

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne({
      user: id
    })
  }

  // static findByRefreshTokenUsed = async (refreshToken) => {
  //   return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
  // }

  // static findByRefreshToken = async (refreshToken) => {
  //   return await keytokenModel.findOne({ refreshToken }).lean()
  // }
}

module.exports = KeyTokenService