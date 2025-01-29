require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const compression = require('compression')

const app = express()

// init middleware
app.use(morgan("dev")) // log
app.use(helmet()) // secure in4 of server when requesting (header, --include)
app.use(compression()) // reduce size of response body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// init DB
require('./dbs/init.mongodb')

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
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error'
  })
})

module.exports = app
