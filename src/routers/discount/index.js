"use strict";

const { Router } = require("express");
const discountController = require("../../controllers/discount.controller");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helper/asyncHandler");
const router = Router();

router.use(authentication);
router.post("/", asyncHandler(discountController.createDiscount));
router.patch("/:code", asyncHandler(discountController.updateDiscount));
router.delete("/:code", asyncHandler(discountController.deleteDiscountCode));
router.patch(
  "/cancel_discount_code",
  asyncHandler(discountController.cancelDiscountCode)
);

// QUERIES
router.get("/", asyncHandler(discountController.getAllDiscountCode));
router.get("/amount", asyncHandler(discountController.getDiscountAmount));
router.get(
  "/list_products_code",
  asyncHandler(discountController.getDiscountCodeBelongToProducts)
);

module.exports = router;
