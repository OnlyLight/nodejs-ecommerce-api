const mongoose = require("mongoose")

const connectString = "mongodb://localhost:27017/shopDEV"

mongoose.connect(connectString)
.then(() => console.log("Connected Mongodb success"))
.catch(err => console.log(`Err:: ${err}`))

// when call will create new connect => take bandwidth
module.exports = mongoose
