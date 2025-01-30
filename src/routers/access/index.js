'use strict'

const { Router } = require('express')
const accessController = require('../../controllers/access.controller')
// instead of try catch block, you can use asyncHandler
const { asyncHandler } = require('../../auth/checkAuth')
const router = Router()

// sign up
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

module.exports = router