"use strict";

const { ErrorResponse } = require("../core/error.response");
const spuModel = require("../models/spu.model");
const { findShopById } = require("../repositories/shop.repo");
const { randomProductId, findOneModelByFilter } = require("../utils");
const statusCodes = require("../utils/statusCodes");
const { newSku, allSkuBySpuId } = require("./sku.service");

class SpuService {
  async newSpu({
    product_id,
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_category,
    product_shop,
    product_attributes,
    product_quantity,
    product_variation,
    sku_list = [],
  }) {
    try {
      const foundShop = await findShopById({ shop_id: product_shop });
      if (!foundShop) {
        throw new ErrorResponse({
          message: "Shop not found",
          status: statusCodes.NOT_FOUND,
        });
      }

      const spu = await spuModel.create({
        product_id: randomProductId(),
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_category,
        product_shop,
        product_attributes,
        product_quantity,
        product_variation,
      });

      if (sku && sku_list.length) {
        return await newSku({ sku_list, sku_id: spu.product_id });
      }
    } catch (error) {
      throw new ErrorResponse({
        message: error.message,
        status: statusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async oneSpu({ spu_id }) {
    try {
      const foundSpu = await findOneModelByFilter({
        model: spuModel,
        filter: { product_id: spu_id, isPublish: false },
        isLean: false,
      });

      if (!foundSpu) {
        throw new ErrorResponse({
          message: "SPU not found",
          status: statusCodes.NOT_FOUND,
        });
      }

      const skus = await allSkuBySpuId({ product_id: foundSpu.product_id });

      return {
        spu_info: _.omit(spu, ["__v", "updateAt"]),
        sku_list: skus.map((sku) =>
          _.omit(sku, ["__v", "updateAt", "createdAt", "isDeleted"])
        ),
      };
    } catch (error) {
      throw new ErrorResponse({
        message: error.message,
        status: statusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  }
}

module.exports = new SpuService();
