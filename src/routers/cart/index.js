"use strict";

const { Router } = require("express");
const cartController = require("../../controllers/cart.controller");
const { asyncHandler } = require("../../helper/asyncHandler");

const router = Router();

router.post("/", asyncHandler(cartController.initialCart));
router.patch("/:userId", asyncHandler(cartController.updateCart));
router.delete("/:userId", asyncHandler(cartController.deleteItemInCart));

// QUERIES
router.get("/:userId", asyncHandler(cartController.getListCart));

module.exports = router;
