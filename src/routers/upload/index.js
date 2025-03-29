"use strict";

const { Router } = require("express");
const { asyncHandler } = require("../../helper/asyncHandler");
const uploadController = require("../../controllers/upload.controller");
const { uploadDisk, uploadMemory } = require("../../configs/multer.config");
// const { authentication } = require("../../auth/authUtils");
// instead of try catch block, you can use asyncHandler
const router = Router();

router.post("/product/", asyncHandler(uploadController.uploadFile));
router.post(
  "/product/thumb",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadFileThumb)
);
router.post(
  "/product/bucket",
  uploadMemory.single("file"),
  asyncHandler(uploadController.uploadFileS3)
);
