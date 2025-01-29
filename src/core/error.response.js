'use strict'

const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409
}

const MessageStatusCode = {
  FORBIDDEN: 'Forbidden Error',
  CONFLICT: 'Conflict Error'
}

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = MessageStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
    super(message, statusCode)
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = MessageStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
    super(message, statusCode)
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError
}
