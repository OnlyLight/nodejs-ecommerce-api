"use strict";

const { Router } = require("express");
const { asyncHandler } = require("../../helper/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const notificationController = require("../../controllers/notification.controller");

const router = Router();

router.get(
  "/",
  authentication,
  asyncHandler(notificationController.getNotiByUserId)
);

module.exports = router;
