'use strict'

const JWT = require('jsonwebtoken')
const crypto = require('crypto')

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

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
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
  } catch (error) {
    console.log(`Err:: ${error}`)
  }
}

module.exports = {
  generateKeyPair,
  createTokenPair
}