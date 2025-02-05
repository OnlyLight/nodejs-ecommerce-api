'use strict'

const { Router } = require('express')
const { asyncHandler } = require('../../helper/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')
// instead of try catch block, you can use asyncHandler
const router = Router()

// authentication
router.use(authentication)
router.post('/shop/logout', asyncHandler(productController.createProduct))

module.exports = router