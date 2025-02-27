"use strict";

const { ErrorResponse } = require("../core/error.response");
const { product, clothing, electronic } = require("../models/product.model");
const { insertInventory } = require("../repositories/inventory.repo");
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unpublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
} = require("../repositories/product.repo");
const {
  getSelectData,
  getUnSelectData,
  updateModel,
  deepClean,
  updateNestedObjectParser,
} = require("../utils");
const statusCodes = require("../utils/statusCodes");

class ProductFactory {
  static productRegistry = {};

  static registerRegistry(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    console.log("type::", type);
    console.log("payload::", payload);

    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new ErrorResponse({
        message: `Invalid product type: ${type}`,
        statusCode: statusCodes.BAD_REQUEST,
      });
    }

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, id, payload) {
    console.log("type::", type);
    console.log("id::", id);
    console.log("payload::", payload);
    console.log("remove null payload::", deepClean(payload));

    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new ErrorResponse({
        message: `Invalid product type: ${type}`,
        statusCode: statusCodes.BAD_REQUEST,
      });
    }

    return new productClass(deepClean(payload)).updateProduct(id);
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unpublishProductByShop({ product_shop, product_id });
  }

  /// Queries
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    return await findAllDraftsForShop({
      query: { product_shop, isDraft: true },
      limit,
      skip,
    });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    return await findAllPublishForShop({
      query: { product_shop, isPublish: true },
      limit,
      skip,
    });
  }

  static async getListSearchProducts({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublish: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: getSelectData([
        "product_name",
        "product_price",
        "product_thumb",
        "product_shop",
      ]),
    });
  }

  static async findProduct({ product_id }) {
    return await findProduct({
      product_id,
      unSelect: getUnSelectData(["__v"]),
    });
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_type,
    product_shop,
    product_attributes,
    product_quantity,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
    this.product_quantity = product_quantity;
  }

  async createProduct(productId) {
    const newProduct = await product.create({ ...this, _id: productId });
    if (!newProduct) {
      throw new ErrorResponse({
        message: "Create new product err",
        statusCode: statusCodes.BAD_REQUEST,
      });
    }

    const result = await insertInventory({
      productId: newProduct._id,
      shopId: newProduct.product_shop,
      stock: newProduct.product_quantity,
    });
    if (!result) {
      throw new ErrorResponse({
        message: "Insert inventory err",
        statusCode: statusCodes.BAD_REQUEST,
      });
    }

    return newProduct;
  }

  async updateProduct(productId, payload) {
    return await updateModel({
      filter: { _id: productId },
      payload,
      model: product,
    });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) {
      throw new ErrorResponse({
        message: "Create new clothing err",
        statusCode: statusCodes.BAD_REQUEST,
      });
    }

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new ErrorResponse({
        message: "Create new product err",
        statusCode: statusCodes.BAD_REQUEST,
      });
    }

    return newProduct;
  }

  async updateProduct(id) {
    // 1. Validate has value null and undefined
    if (!this.product_attributes) {
      throw new ErrorResponse({
        message: "Missing required field",
        statusCode: statusCodes.BAD_REQUEST,
      });
    }

    // 2. check what attributes need to update product_atributes
    const updateAttributes = await updateModel({
      filter: { _id: id },
      payload: {
        ...this.product_attributes,
        product_shop: this.product_shop,
      },
      model: clothing,
    });
    if (!updateAttributes) {
      throw new ErrorResponse({
        message: "Update clothing err",
        statusCode: statusCodes.BAD_REQUEST,
      });
    }

    // 3. update product
    const updateProduct = await super.updateProduct(
      updateAttributes._id,
      updateNestedObjectParser(this)
    );
    if (!updateProduct) {
      throw new ErrorResponse({
        message: "Update product err",
        statusCode: statusCodes.BAD_REQUEST,
      });
    }

    return updateProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) {
      throw new ErrorResponse({
        message: "Create new clothing err",
        statusCode: statusCodes.BAD_REQUEST,
      });
    }

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new ErrorResponse({
        message: "Create new product err",
        statusCode: statusCodes.BAD_REQUEST,
      });
    }

    return newProduct;
  }

  async updateProduct(id) {
    // 1. Validate has value null and undefined
    if (!this.product_attributes) {
      throw new ErrorResponse({
        message: "Missing required field",
        statusCode: statusCodes.BAD_REQUEST,
      });
    }

    // 2. check what attributes need to update product_atributes
    const updateAttributes = await updateModel({
      filter: { _id: id },
      payload: {
        ...this.product_attributes,
        product_shop: this.product_shop,
      },
      model: electronic,
    });
    if (!updateAttributes) {
      throw new ErrorResponse({
        message: "Update electronic err",
        statusCode: statusCodes.BAD_REQUEST,
      });
    }

    // 3. update product
    const updateProduct = await super.updateProduct(
      updateAttributes._id,
      updateNestedObjectParser(this)
    );
    if (!updateProduct) {
      throw new ErrorResponse({
        message: "Update product err",
        statusCode: statusCodes.BAD_REQUEST,
      });
    }

    return updateProduct;
  }
}

ProductFactory.registerRegistry("Clothing", Clothing);
ProductFactory.registerRegistry("Electronics", Electronic);

module.exports = ProductFactory;
