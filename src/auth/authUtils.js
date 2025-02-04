'use strict'

const JWT = require('jsonwebtoken')
const crypto = require('crypto')
const { asyncHandler } = require('../helper/asyncHandler')
const { ErrorResponse } = require('../core/error.response')
const statusCodes = require('../utils/statusCodes')
const { findByUserId } = require('../services/keyToken.service')

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization'
}

const generateKeyPair = () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    }
  })

  return { privateKey, publicKey }
}

const createTokenPair = asyncHandler(async (payload, publicKey, privateKey) => {
  const accessToken = await JWT.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '15m'
  })

  const refreshToken = await JWT.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '7d'
  })

  JWT.verify(accessToken, publicKey, (err, decoded) => {
    if (err) {
      console.error('Error verify access token::', err)
    } else {
      console.log('Decoded access token::', decoded)
    }
  })

  return { accessToken, refreshToken }
})

const authentication = asyncHandler(async (req, res, next) => {
  // 1. check userId exist
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) {
    throw new ErrorResponse({
      statusCode: statusCodes.UNAUTHORIZED
    })
  }

  // 2. get accessToken
  const keyStore = await findByUserId(userId)
  if (!keyStore) {
    throw new ErrorResponse({
      statusCode: statusCodes.NOT_FOUND
    })
  }

  // 3. verifyToken
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) {
    throw new ErrorResponse({
      statusCode: statusCodes.UNAUTHORIZED
    })
  }

  JWT.verify(accessToken, keyStore.publicKey, (err, decoded) => {
    if (err) {
      throw new ErrorResponse({
        statusCode: statusCodes.UNAUTHORIZED
      })
    }

    if (decoded.userId !== userId) {
      throw new ErrorResponse({
        statusCode: statusCodes.UNAUTHORIZED,
        message: 'Invalid userId'
      })
    }

    console.log('Decoded access token::', decoded)

    req.keyStore = keyStore

    return next()
  })

  // 4. check user in DB
  // 5. check keyStore with userId
})

module.exports = {
  generateKeyPair,
  createTokenPair,
  authentication
}