"use strict";

const { Router } = require("express");
const checkoutController = require("../../controllers/checkout.controller");
const { asyncHandler } = require("../../helper/asyncHandler");

const router = Router();

// QUERIES
router.get("/", asyncHandler(checkoutController.checkoutReview));

module.exports = router;
