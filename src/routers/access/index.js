'use strict'

const { Router } = require('express')
const accessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const router = Router()

// sign up
router.post('/shop/signup', asyncHandler(accessController.signUp))

module.exports = router