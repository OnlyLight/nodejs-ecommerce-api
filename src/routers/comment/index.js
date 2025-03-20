"use strict";

const { Router } = require("express");
const { asyncHandler } = require("../../helper/asyncHandler");
const commentController = require("../../controllers/comment.controller");
const { authentication } = require("../../auth/authUtils");

const router = Router();

router.post("/", authentication, asyncHandler(commentController.createComment));
router.delete(
  "/",
  authentication,
  asyncHandler(commentController.deleteComments)
);

// QUERIES
router.get(
  "/",
  authentication,
  asyncHandler(commentController.getCommentsByParentId)
);

module.exports = router;
