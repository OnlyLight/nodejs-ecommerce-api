"use strict";

const { Types } = require("mongoose");
const { ErrorResponse } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const statusCodes = require("../utils/statusCodes");
const { getUnSelectData, findAllInModel, getSelectData } = require("../utils");
const { product } = require("../models/product.model");
const {
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesBelongToProducts,
  createDiscount,
  updateDiscount,
  getDiscountAmount,
  deleteDiscount,
  cancelDiscountCode,
} = require("../repositories/discount.repo");

/**
  Discount service
  1 - Generator Discount Code [Shop | Admin]
  2 - Get discount ammount [User]
  3 - Get all discount codes [User | Shop]
  4 - Verify discount code [User]
  5 - Delete discount code [Admin | Shop]
  6 - Cancel discount code [User]
*/

class DiscountService {
  static async createDiscountCode({ shopId, payload }) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_uses,
      uses_count,
      users_used,
      max_uses_per_user,
    } = payload;

    if (new Date(start_date) >= new Date(end_date)) {
      throw new ErrorResponse({
        statusCode: statusCodes.BAD_REQUEST,
        message: "Start date must be before end date",
      });
    }

    const newDiscount = await createDiscount({
      code,
      start_date,
      end_date,
      is_active,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_uses,
      uses_count,
      users_used,
      max_uses_per_user,
      shopId,
    });

    return newDiscount;
  }

  static async updateDiscountCode({ shopId, code, newCode }) {
    return updateDiscount({ shopId, code, newCode });
  }

  static async deleteDiscountCode({ code, shopId }) {
    return await deleteDiscount({ code, shopId });
  }

  static async cancelDiscountCode({ code, shopId, userId }) {
    return await cancelDiscountCode({ code, shopId, userId });
  }

  // QUERIES
  static async getAllDiscountCodesBelongToProducts({
    limit = 50,
    page = 1,
    code,
    shopId,
  }) {
    return await findAllDiscountCodesBelongToProducts({
      limit,
      page,
      code,
      shopId,
    });
  }

  static async getAllDiscountCodesByShop({ limit = 50, page = 1, shopId }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit,
      page,
      shopId,
    });

    return discounts;
  }

  static async getDiscountAmount({ code, userId, shopId, products }) {
    return await getDiscountAmount({ code, userId, shopId, products });
  }
}

module.exports = DiscountService;
