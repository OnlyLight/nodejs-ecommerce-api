"use strict";

const { Types } = require("mongoose");
const { ErrorResponse } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const statusCodes = require("../utils/statusCodes");
const { getUnSelectData, findAllInModel } = require("../utils");

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

    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: new Types.ObjectId(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new ErrorResponse({
        statusCode: statusCodes.BAD_REQUEST,
        message: "Discount Code already exists",
      });
    }

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_value_to_use: min_order_value || 0,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_use_amount: max_uses,
      discount_used_amount: uses_count,
      discount_users: users_used,
      discount_shopId: new Types.ObjectId(shopId),
      discount_max_use_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_product_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async getAllDiscountCodesByShop({ limit = 50, page = 1, shopId }) {
    const discounts = await findAllInModel({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: new Types.ObjectId(shopId),
        discount_is_active: true,
      },
      select: getUnSelectData(["__v", "discount_shopId"]),
      model: discountModel,
    });

    return discounts;
  }
}

module.exports = DiscountService;
