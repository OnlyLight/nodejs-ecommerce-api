'use strict'

const { Router } = require('express')
const { asyncHandler } = require('../../helper/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')
// instead of try catch block, you can use asyncHandler
const router = Router()

router.get('/search', asyncHandler(productController.searchProduct))
router.get('/', asyncHandler(productController.findAllProducts))
router.get('/:id', asyncHandler(productController.findProduct))

// authentication
router.use(authentication)
router.post('/', asyncHandler(productController.createProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/un-publish/:id', asyncHandler(productController.unPublishProductByShop))

/// QUERIES
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishForShop))

module.exports = router