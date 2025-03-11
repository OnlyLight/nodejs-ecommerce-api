"use strict";

const { Router } = require("express");
const { apiKey, permissions } = require("../auth/checkAuth");
const router = Router();

// check apiKey
router.use(apiKey);

// check permission
router.use(permissions("0000"));

router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api/checkout", require("./checkout"));

// authentication
router.use("/v1/api", require("./access"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/api/inventory", require("./inventory"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/comment", require("./comment"));

module.exports = router;
