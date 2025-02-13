"use strict";

const { Router } = require("express");
const discountController = require("../../controllers/discount.controller");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helper/asyncHandler");
const router = Router();

router.use(authentication);
router.post("/", asyncHandler(discountController.createDiscount));

// QUERIES
router.get("/", asyncHandler(discountController.getAllDiscountCode));

module.exports = router;
