"use strict";

const { Router } = require("express");
const cartController = require("../../controllers/cart.controller");

const router = Router();

router.post("/", asyncHandler(cartController.createCart));
router.delete("/:userId", asyncHandler(cartController.deleteItemInCart));

// QUERIES
router.get("/:userId", asyncHandler(cartController.getListCart));
