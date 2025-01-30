'use strict'

const messagePhrases = require("../utils/messagePhrases")

class SuccessResponse {
  constructor({ message, statusCode, metadata }) {
    this.message = message ? message : messagePhrases[statusCode]
    this.statusCode = statusCode
    this.metadata = metadata
  }

  send(res, headers = {}) {
    return res.status(this.statusCode).json(this)
  }
}

module.exports = {
  SuccessResponse
}
