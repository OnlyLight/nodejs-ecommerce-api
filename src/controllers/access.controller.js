'use strict'

class AccessController {
  signUp = async (req, res, next) => {
    try {
      // code here
      return res.status(200).json(await AccessService.signUp(req.body))
    } catch (error) {
      console.log(`Err:: ${error}`)
      next(error)
    }
  }
}

module.exports = new AccessController()