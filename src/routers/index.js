'use strict'

const { Router } = require('express')
const { apiKey, permissions } = require('../auth/checkAuth')
const router = Router()

// check apiKey
router.use(apiKey)

// check permission
router.use(permissions('0000'))

router.use('/v1/api', require('./access'))
router.use('/v1/api/product', require('./product'))

module.exports = router