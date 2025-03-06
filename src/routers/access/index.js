"use strict";

const { Router } = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helper/asyncHandler");
const { authentication } = require("../../auth/authUtils");
// instead of try catch block, you can use asyncHandler
const router = Router();

// sign up
router.post("/shop/signup", asyncHandler(accessController.signUp));
router.post("/shop/login", asyncHandler(accessController.login));

// authentication
// router.use(authentication)
router.post(
  "/shop/logout",
  authentication,
  asyncHandler(accessController.logout)
);
router.post(
  "/shop/handlerRefreshToken",
  authentication,
  asyncHandler(accessController.handlerRefreshToken)
);

module.exports = router;
