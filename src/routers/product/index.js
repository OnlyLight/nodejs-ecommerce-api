"use strict";

const { Router } = require("express");
const { asyncHandler } = require("../../helper/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");
// instead of try catch block, you can use asyncHandler
const router = Router();

router.get("/search", asyncHandler(productController.searchProduct));
router.get("/", asyncHandler(productController.findAllProducts));
router.get("/:id", asyncHandler(productController.findProduct));
router.get("/sku/select_variation", asyncHandler(productController.findOneSku));
router.get("/spu/info", asyncHandler(productController.findOneSpu));

// authentication
// router.use(authentication)
router.post("/", authentication, asyncHandler(productController.createProduct));
router.post(
  "/spu/new",
  authentication,
  asyncHandler(productController.createSPU)
);
router.patch(
  "/:id",
  authentication,
  asyncHandler(productController.updateProduct)
);
router.post(
  "/publish/:id",
  authentication,
  asyncHandler(productController.publishProductByShop)
);
router.post(
  "/un-publish/:id",
  authentication,
  asyncHandler(productController.unPublishProductByShop)
);

/// QUERIES
router.get(
  "/drafts/all",
  authentication,
  asyncHandler(productController.getAllDraftsForShop)
);
router.get(
  "/published/all",
  authentication,
  asyncHandler(productController.getAllPublishForShop)
);

module.exports = router;
