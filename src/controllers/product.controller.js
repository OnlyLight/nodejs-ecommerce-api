"use strict";

const { SuccessResponse } = require("../core/success.response");
const ProductFactory = require("../services/product.service");
const statusCodes = require("../utils/statusCodes");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      statusCode: statusCodes.CREATED,
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.decodedUser.userId,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await ProductFactory.updateProduct(
        req.body.product_type,
        req.params.id,
        {
          ...req.body,
          product_shop: req.decodedUser.userId,
        }
      ),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await ProductFactory.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.decodedUser.userId,
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await ProductFactory.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.decodedUser.userId,
      }),
    }).send(res);
  };

  getAllDraftsForShop = async (req, res, next) => {
    const { limit, skip } = req.body;

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await ProductFactory.findAllDraftsForShop({
        product_shop: req.decodedUser.userId,
        limit,
        skip,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    const { limit, skip } = req.body;

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await ProductFactory.findAllPublishForShop({
        product_shop: req.decodedUser.userId,
        limit,
        skip,
      }),
    }).send(res);
  };

  searchProduct = async (req, res, next) => {
    const { key } = req.query;

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await ProductFactory.getListSearchProducts({
        keySearch: key,
      }),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    const { limit, sort, page } = req.query;
    const { filter } = req.body;

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await ProductFactory.findAllProducts({
        limit,
        sort,
        page,
        filter,
      }),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await ProductFactory.findProduct({
        product_id: req.params.id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
