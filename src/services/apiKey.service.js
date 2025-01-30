'use strict'

const crypto = require('crypto')

const apiKeyModel = require("../models/apiKey.model")

const findById = async (key) => {
  const apiKey = await apiKeyModel.findOne({
    key,
    status: true
  }).lean()

  return apiKey
}

module.exports = {
  findById
}
