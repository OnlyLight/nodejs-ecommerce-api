"use strict";

const { Router } = require("express");
const { asyncHandler } = require("../../helper/asyncHandler");
const { grantAccess } = require("../../middlewares/rbac.middleware");
const profileController = require("../../controllers/profile.controller");
// instead of try catch block, you can use asyncHandler
const router = Router();

router.get(
  "/view_any",
  grantAccess("readAny", "profile"),
  asyncHandler(profileController.profiles)
);
router.get(
  "/view_any",
  grantAccess("readOwn", "profile"),
  asyncHandler(profileController.profile)
);

module.exports = router;
