'use strict'

// // lv0
// const config = {
//   app: {
//     port: process.env.PORT || 3056
//   },
//   db: {
//     host: 'localhost',
//     port: 27017,
//     name: 'shopDEV'
//   }
// }

// lv1
const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3056
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || 'shopDEV'
  }
}

const prod = {
  app: {
    port: process.env.PROD_APP_PORT || 3000
  },
  db: {
    host: process.env.PROD_DB_HOST || 'localhost',
    port: process.env.PROD_DB_PORT || 27017,
    name: process.env.PROD_DB_NAME || 'shopPROD'
  }
}

const config = { dev, prod }
const env = process.env.NODE_ENV || 'dev'

module.exports = config[env]
