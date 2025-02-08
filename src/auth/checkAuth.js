'use strict'

const { asyncHandler } = require("../helper/asyncHandler")
const { findById } = require("../services/apiKey.service")

const HEADER = {
  API_KEY: 'x-api-key'
}

const apiKey = asyncHandler(async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]

  if (!key) {
    return res.status(403).json({ message: 'Forbidden Error' })
  }

  // curl get apiKey through apiKey schema
  const objKey = await findById(key)
  if (!objKey) {
    return res.status(403).json({ message: 'Forbidden Error' })
  }

  req.objKey = objKey

  return next()
})

const permissions = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({ message: 'Permission Denied' })
    }

    const validPermission = req.objKey.permissions.includes(permission)
    if (!validPermission) {
      return res.status(403).json({ message: 'Permission Denied' })
    }

    return next()
  }
}

module.exports = {
  apiKey,
  permissions
}