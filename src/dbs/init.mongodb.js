'use strict'

const mongoose = require("mongoose")
const { countConnect } = require("../helper/check.connect")

const connectString = "mongodb://localhost:27017/shopDEV"

class Database {
  constructor() {
    this.connect()
  }

  connect(type = 'mongodb') {
    mongoose.set('debug', true)
    mongoose.set('debug', {color: true})
    mongoose.connect(connectString, {
      maxPoolSize: 50
    })
      .then(() => console.log(`Connected Mongodb success::${countConnect}`))
      .catch(err => console.log(`Err:: ${err}`))
  }

  static getInstance() {
    if (!Database.instance)
      Database.instance = new Database()

    return Database.instance
  }
}

// const db = (() => {
//   let instance;

//   init(type = 'mongodb') {
//     mongoose.set('debug', true)
//     mongoose.set('debug', { color: true })
//     mongoose.connect(connectString)
//       .then(() => console.log("Connected Mongodb success"))
//       .catch(err => console.log(`Err:: ${err}`))
//   }

//   return {
//     getInstance() {
//       if (!instance)
//         instance = init()

//       return instance
//     }
//   }
// })();

module.exports = Database.getInstance()
