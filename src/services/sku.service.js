"use strict";

const { ErrorResponse } = require("../core/error.response");
const skuModel = require("../models/sku.model");
const { randomProductId, findOneModelByFilter } = require("../utils");
const statusCodes = require("../utils/statusCodes");
const _ = require("lodash");

class SKUService {
  async newSku({ sku_id, sku_list }) {
    try {
      const convert_sku_list = sku_list.map((sku) => {
        return {
          ...sku,
          product_id: sku_id,
          sku_id: `${sku_id}.${randomProductId()}`,
        };
      });

      const skus = await skuModel.create({ convert_sku_list });

      return skus;
    } catch (error) {
      throw new ErrorResponse(error.message, statusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async oneSku({ sku_id, product_id }) {
    try {
      const sku = await findOneModelByFilter({
        model: skuModel,
        filter: { sku_id, product_id },
      });

      if (!sku) {
        throw new ErrorResponse("SKU not found", statusCodes.NOT_FOUND);
      }

      // set cached

      return _.omit(sku, ["__v", "updateAt", "createdAt", "isDeleted"]);
    } catch (error) {
      throw new ErrorResponse(error.message, statusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async allSkuBySpuId({ product_id }) {
    try {
      const skus = await findOneModelByFilter({
        model: skuModel,
        filter: { product_id },
      });

      return skus;
    } catch (error) {
      throw new ErrorResponse(error.message, statusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

module.exports = new SKUService();
