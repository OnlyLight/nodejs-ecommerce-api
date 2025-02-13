"use strict";

const { Types } = require("mongoose");
const { product } = require("../models/product.model");
const { findAllInModel, findOneModelById } = require("../utils");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 }) // sort by latest update
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
  // exec() let we know that we have asynchronous
};

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = RegExp(keySearch);
  console.log("keySearch::", keySearch);

  const result = await product
    .find(
      {
        $text: { $search: regexSearch },
        isDraft: false,
        isPublish: true,
      },
      { score: { $meta: "textScore" } }
    ) // search text and sort by score match with text search
    .sort({ score: { $meta: "textScore" } }) // sort by score text match
    .lean();

  return result;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const products = await findAllInModel({
    model: product,
    filter,
    limit,
    select,
    sort,
  });
  // const products = await product.find(filter)
  //   .sort(sortBy).skip(skip).limit(limit).select(select).lean()

  return products;
};

const findProduct = async ({ product_id, unSelect }) => {
  return await findOneModelById({
    model: product,
    id: product_id,
    select: unSelect,
  });
  // return await product.findById(product_id).select(unSelect).lean();
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: product_shop,
    _id: product_id,
  });
  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublish = true;

  const { nModified } = await product.updateOne(
    { _id: foundShop._id },
    {
      $set: { ...foundShop },
    },
    { new: true }
  );

  return nModified;
};

const unpublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublish = false;

  const { nModified } = await product.updateOne(
    { _id: foundShop._id },
    {
      $set: { ...foundShop },
    },
    { new: true }
  );

  return nModified;
};

module.exports = {
  findAllDraftsForShop,
  findAllPublishForShop,
  findAllProducts,
  findProduct,
  searchProductByUser,
  publishProductByShop,
  unpublishProductByShop,
};
