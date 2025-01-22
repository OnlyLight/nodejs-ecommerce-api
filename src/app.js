const express = require('express')
const morgan = require('morgan')
const { default: helmet } = require('helmet')
const compression = require('compression')

const app = express()

// init middleware
app.use(morgan("dev")) // log
app.use(helmet()) // secure in4 of server when requesting (header, --include)
app.use(compression()) // reduce size of response body

// init DB

// init router

// handling error

module.exports = app
