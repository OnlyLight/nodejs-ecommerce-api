require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const compression = require('compression')
const crypto = require('crypto')

const { ErrorResponse } = require('./core/error.response')
const apiKeyModel = require('./models/apiKey.model')
const { getInfoDta } = require('./utils')
const statusCodes = require('./utils/statusCodes')

const app = express()

// init middleware
app.use(morgan("dev")) // log
app.use(helmet()) // secure in4 of server when requesting (header, --include)
app.use(compression()) // reduce size of response body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// init DB
require('./dbs/init.mongodb')

app.post('/key', async (req, res) => {
  const newKey = await apiKeyModel.create({
    key: crypto.randomBytes(64).toString("hex"),
    permissions: ['0000']
  })

  res.status(statusCodes.CREATED).json({
    key: getInfoDta({
      object: newKey,
      fields: ["_id", "key", "status", "permissions"]
    })
  })
})

// init router
app.use('', require('./routers'))

// handling error
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res) => {
  const statusCode = error.status || 500
  return ErrorResponse({
    message: error.message,
    statusCode
  }).send(res)
})

module.exports = app
