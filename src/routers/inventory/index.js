"use strict";

const { Router } = require("express");
const { asyncHandler } = require("../../helper/asyncHandler");
const inventoryController = require("../../controllers/inventory.controller");
const { authentication } = require("../../auth/authUtils");

const router = Router();

// router.use(authentication);
router.post("/", authentication, asyncHandler(inventoryController.addStock));

module.exports = router;
