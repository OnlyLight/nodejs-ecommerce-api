"use strict";

const { Router } = require("express");
const { asyncHandler } = require("../../helper/asyncHandler");
const rbacController = require("../../controllers/rbac.controller");
// instead of try catch block, you can use asyncHandler
const router = Router();

router.post("/role", asyncHandler(rbacController.newRole));
router.post("/resource", asyncHandler(rbacController.newResource));

// QUERIES
router.get("/roles", asyncHandler(rbacController.listRole));
router.get("/resources", asyncHandler(rbacController.listResource));

module.exports = router;
