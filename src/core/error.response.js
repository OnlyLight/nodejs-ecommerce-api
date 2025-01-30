'use strict'

const messagePhrases = require("../utils/messagePhrases")

class ErrorResponse extends Error {
  constructor({ message, statusCode }) {
    super(message ? message : messagePhrases[statusCode])
    this.statusCode = statusCode
  }
}

module.exports = {
  ErrorResponse
}
