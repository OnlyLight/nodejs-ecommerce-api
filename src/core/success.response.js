'use strict'

const StatusCode = {
  OK: 200,
  CREATED: 201
}

const MessageStatusCode = {
  OK: 'OK',
  CREATED: 'Created',
}

class SuccessResponse {
  constructor(message, statusCode, metadata) {
    this.message = message
    this.statusCode = statusCode
    this.metadata = metadata
  }

  send(res, headers = {}) {
    return res.status(this.statusCode).json(this)
  }
}

class CreatedResponse extends SuccessResponse {
  constructor({message = MessageStatusCode.CREATED, statusCode = StatusCode.CREATED, metadata = {}}) {
    super(message, statusCode, metadata)
  }
}

class OkResponse extends SuccessResponse {
  constructor({message = MessageStatusCode.OK, statusCode = StatusCode.OK, metadata = {}}) {
    super(message, statusCode, metadata)
  }
}

module.exports = {
  CreatedResponse,
  OkResponse
}
