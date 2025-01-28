'use strict'

const { Router } = require('express')
const accessController = require('../../controllers/access.controller')
const router = Router()

// sign up
router.post('/shop/signup', accessController.signUp)

module.exports = router