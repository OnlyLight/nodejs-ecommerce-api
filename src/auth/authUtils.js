'use strict'

const JWT = require('jsonwebtoken')

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
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
  } catch (error) {

  }
}

module.exports = {
  createTokenPair
}