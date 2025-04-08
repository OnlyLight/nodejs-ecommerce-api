"use strict";

const { ErrorResponse } = require("../core/error.response");

const readCache = async (req, res, next) => {
  const { sku_id, product_id } = req.query;
  if (!sku_id || !product_id) {
    throw new ErrorResponse({
      statusCode: statusCodes.BAD_REQUEST,
      message: "Missing required query parameters: sku_id, product_id",
    });
  }

  const skuKeyCache = `${CACHE_PRODUCT.SKU}-${sku_id}`;
  const skuCache = await getCacheIO({ key: skuKeyCache });

  if (!skuCache) return next();

  if (skuCache) {
    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: {
        ...JSON.parse(skuCache),
        toLoad: "cache_middlenware",
      },
    }).send(res);
  }
};

module.exports = {
  readCache,
};
