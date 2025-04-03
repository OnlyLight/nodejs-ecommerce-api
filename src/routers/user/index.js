"use strict";

const { Router } = require("express");
const { asyncHandler } = require("../../helper/asyncHandler");
const userController = require("../../controllers/user.controller");

const router = Router();

router.post("/new_user", asyncHandler(userController.newUser));

module.exports = router;
