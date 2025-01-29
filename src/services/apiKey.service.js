'use strict'

const apiKeyModel = require("../models/apiKey.model")

const findById = async (key) => {
  // const newKey = await apiKeyModel.create({
  //   key: crypto.randomBytes(64).toString("hex"),
  //   permissions: ['0000']
  // })

  const apiKey = await apiKeyModel.findOne({
    key,
    status: true
  }).lean()

  return apiKey
}

module.exports = {
  findById
}
