"use strict";

const { Types } = require("mongoose");
const {
  getUnSelectData,
  findAllInModel,
  getSelectData,
  updateModel,
  findOneModelByFilter,
} = require("../utils");
const discountModel = require("../models/discount.model");
const { ErrorResponse } = require("../core/error.response");
const statusCodes = require("../utils/statusCodes");

const createDiscount = async ({
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
}) => {
  const foundDiscount = await findOneModelByFilter({
    model: discountModel,
    filter: {
      discount_code: code,
      discount_shopId: new Types.ObjectId(shopId),
    },
  });

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
};

const updateDiscount = async ({ shopId, code, newCode }) => {
  const foundDiscount = await findOneModelByFilter({
    model: discountModel,
    filter: {
      discount_code: code,
      discount_shopId: new Types.ObjectId(shopId),
    },
  });

  if (!foundDiscount || !foundDiscount.discount_is_active) {
    throw new ErrorResponse({
      statusCode: statusCodes.NOT_FOUND,
      message: "Discount not found",
    });
  }

  const newDis = await updateModel({
    filter: {
      discount_code: foundDiscount.discount_code,
      discount_shopId: new Types.ObjectId(foundDiscount.discount_shopId),
    },
    payload: {
      $set: { discount_code: newCode },
    },
    model: discountModel,
  });

  return newDis;
};

const deleteDiscount = async ({ code, shopId }) => {
  const foundDiscount = await findOneModelByFilter({
    model: discountModel,
    filter: {
      discount_code: code,
      discount_shopId: new Types.ObjectId(shopId),
    },
  });

  if (!foundDiscount || !foundDiscount.discount_is_active) {
    throw new ErrorResponse({
      statusCode: statusCodes.NOT_FOUND,
      message: "Discount not found",
    });
  }

  const result = await updateModel({
    filter: {
      _id: foundDiscount._id,
    },
    payload: {
      $set: { discount_is_active: false },
    },
  });

  return result;
};

const cancelDiscountCode = async ({ code, shopId, userId }) => {
  const foundDiscount = await findOneModelByFilter({
    model: discountModel,
    filter: {
      discount_code: code,
      discount_shopId: new Types.ObjectId(shopId),
    },
  });

  if (!foundDiscount || !foundDiscount.discount_is_active) {
    throw new ErrorResponse({
      statusCode: statusCodes.NOT_FOUND,
      message: "Discount not found",
    });
  }

  const result = await updateModel({
    filter: {
      _id: foundDiscount._id,
    },
    payload: {
      $pull: { discount_users: userId },
      $inc: { discount_used_amount: -1 },
    },
  });

  return result;
};

// QUERIES
const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  page = 1,
  shopId,
}) => {
  return await findAllInModel({
    limit: +limit,
    page: +page,
    filter: {
      discount_shopId: new Types.ObjectId(shopId),
      discount_is_active: true,
    },
    select: getUnSelectData(["__v", "discount_shopId"]),
    model: discountModel,
  });
};

const findAllDiscountCodesBelongToProducts = async ({
  limit = 50,
  page = 1,
  code,
  shopId,
}) => {
  const foundDiscountCodes = await discount
    .findOne({
      discount_code: code,
      discount_shopId: new Types.ObjectId(shopId),
    })
    .lean();

  if (!foundDiscountCodes || !foundDiscountCodes.discount_is_active) {
    throw new ErrorResponse({
      statusCode: statusCodes.NOT_FOUND,
      message: "Discount Code not found",
    });
  }

  const {
    discount_product_applies_to,
    discount_product_ids,
  } = foundDiscountCodes;

  if (discount_product_applies_to === "all_products") {
    return await findAllInModel({
      limit: +limit,
      page: +page,
      filter: {
        product_shop: new Types.ObjectId(shopId),
        isPublish: true,
      },
      select: getSelectData(["product_name"]),
      model: product,
    });
  }

  if (discount_product_applies_to === "specific_products") {
    return await findAllInModel({
      limit: +limit,
      page: +page,
      filter: {
        _id: { $in: discount_product_ids },
        isPublish: true,
      },
      select: getSelectData(["product_name"]),
      model: product,
    });
  }
};

const getDiscountAmount = async ({ code, userId, shopId, products = [] }) => {
  const foundDiscount = await findOneModelByFilter({
    model: discountModel,
    filter: {
      discount_code: code,
      discount_shopId: new Types.ObjectId(shopId),
    },
  });

  if (!foundDiscount || !foundDiscount.discount_is_active) {
    throw new ErrorResponse({
      statusCode: statusCodes.NOT_FOUND,
      message: "Discount not found",
    });
  }

  const {
    discount_max_use_amount,
    discount_start_date,
    discount_end_date,
    discount_min_value_to_use,
    discount_max_use_per_user,
    discount_type,
    discount_value,
    discount_users,
  } = foundDiscount;

  if (!discount_max_use_amount) {
    throw new ErrorResponse({
      statusCode: statusCodes.NOT_FOUND,
      message: "Discount out of",
    });
  }

  const now = new Date();
  const startDate = new Date(discount_start_date);
  const endDate = new Date(discount_end_date);

  if (now <= startDate || now >= endDate) {
    throw new ErrorResponse({
      statusCode: statusCodes.NOT_FOUND,
      message: "Discount expired",
    });
  }

  let totalOrder = 0;
  if (discount_min_value_to_use > 0) {
    totalOrder = products.reduce((acc, product) => {
      return acc + product.product_quantity * product.product_price;
    }, 0);

    if (totalOrder < discount_min_value_to_use) {
      throw new ErrorResponse({
        statusCode: statusCodes.NOT_FOUND,
        message: "Order value is less than minimum value to use",
      });
    }
  }

  if (discount_max_use_per_user > 0) {
    const useUserDiscount = discount_users.find(
      (user) => user.userId == userId
    );

    if (useUserDiscount && useUserDiscount.count >= discount_max_use_per_user) {
      throw new ErrorResponse({
        statusCode: statusCodes.NOT_FOUND,
        message: "User already used the maximum number of discount",
      });
    }
  }

  const amount =
    discount_type === "fixed"
      ? discount_value
      : totalOrder * (discount_value / 100);

  return {
    totalOrder,
    discount: amount,
    totalPrice: totalOrder - amount,
  };
};

module.exports = {
  createDiscount,
  updateDiscount,
  deleteDiscount,
  cancelDiscountCode,
  // QUERIES
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesBelongToProducts,
  getDiscountAmount,
};
