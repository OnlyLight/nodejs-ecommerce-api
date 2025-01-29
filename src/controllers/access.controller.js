'use strict'

const { CreatedResponse } = require("../core/success.response")
const AccessService = require("../services/access.service")

class AccessController {
  signUp = async (req, res, next) => {
    // return res.status(200).json(await AccessService.signUp(req.body))
    // instead of try catch block, you can use asyncHandler
    // try {
    //   // code here
    // } catch (error) {
    //   console.log(`Err:: ${error}`)
    //   next(error)
    // }
    new CreatedResponse({
      message: "Register successfully",
      metadata: await AccessService.signUp(req.body)
    }).send(res)
  }
}

module.exports = new AccessController()