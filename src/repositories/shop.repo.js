"use strict";

const shopModel = require("../models/shop.model");
const { findOneModelById, getSelectData } = require("../utils");

const findByEmail = async ({
  email,
  select = getSelectData(["email", "password", "name", "status", "roles"]),
}) => {
  return await shopModel.findOne({ email }).select(select);
};

const findShopById = async ({
  shop_id,
  select = getSelectData(["email", "name", "status", "roles"]),
}) => {
  return await findOneModelById({
    model: shopModel,
    id: shop_id,
    select,
    isLean: false,
  });
};

module.exports = {
  findByEmail,
  findShopById,
};
