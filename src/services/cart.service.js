"use strict";

const { Types } = require("mongoose");
const cartModel = require("../models/cart.model");
const { product } = require("../models/product.model");
const {
  createUserCart,
  updateUserCartQuantity,
} = require("../repositories/cart.repo");
const { findOneModelByFilter, updateModel } = require("../utils");
const { ErrorResponse } = require("../core/error.response");
const statusCodes = require("../utils/statusCodes");

/**
 * 1. Add product to user [user]
 * 2. reduce product quantity by one [user]
 * 3. increase product quantity by one [user]
 * 4. get cart [user]
 * 5. delete cart [user]
 * 6. delete cart item [user]
 */

class CartService {
  static async addToCart({ userId, product = {} }) {
    const userCart = await findOneModelByFilter({
      filter: {
        cart_userId: userId,
      },
      model: cartModel,
      isLean: false,
    });

    if (!userCart) {
      return await createUserCart({ userId, product });
    }

    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    return await updateUserCartQuantity({ userId, product });
  }

  static async updateCart({ userId, products = [] }) {
    // payload example
    // {
    //   "products": [
    //     {
    //       "shop_id": "",
    //       "item_products": [{
    //         "product_id": "",
    //         "product_quantity": "",
    //         "product_name": "",
    //         "product_price": ""
    //       }]
    //     }
    //   ]
    // }

    if (!Array.isArray(products) || products.length === 0) {
      throw new ErrorResponse({
        statusCode: statusCodes.BAD_REQUEST,
        message: "Invalid products array",
      });
    }

    const updatedProducts = [];

    for (let p of products) {
      if (!p.item_products || !Array.isArray(p.item_products)) {
        throw new ErrorResponse({
          statusCode: statusCodes.BAD_REQUEST,
          message: "Invalid item_products array",
        });
      }

      for (let item of p.item_products) {
        const { product_id, product_quantity, old_quantity } = item;

        if (!product_id || typeof product_quantity !== "number") {
          throw new ErrorResponse({
            statusCode: statusCodes.BAD_REQUEST,
            message: "Invalid product data",
          });
        }

        const foundProduct = await findOneModelByFilter({
          filter: {
            _id: new Types.ObjectId(product_id),
          },
          model: product,
        });

        if (!foundProduct) {
          throw new ErrorResponse({ statusCode: statusCodes.NOT_FOUND });
        }

        if (foundProduct.product_shop.toString() !== p?.shop_id) {
          throw new ErrorResponse({ statusCode: statusCodes.NOT_FOUND });
        }

        if (product_quantity === 0) {
          await CartService.deleteItemInCart({
            userId,
            productId: product_id,
          });

          updatedProducts.push({ product_id, status: "deleted" });
        } else {
          const updateCart = await updateUserCartQuantity({
            userId,
            product: {
              product_id,
              product_quantity: product_quantity - (old_quantity || 0),
            },
          });

          updatedProducts.push({
            product_id,
            status: "updated",
            update_cart: updateCart,
          });
        }
      }
    }

    return updatedProducts;

    // const {
    //   product_id,
    //   product_quantity,
    //   old_quantity,
    // } = products[0]?.item_products[0];

    // const foundProduct = await findOneModelByFilter({
    //   filter: {
    //     _id: new Types.ObjectId(product_id),
    //   },
    //   model: product,
    // });

    // if (!foundProduct) {
    //   throw new ErrorResponse({ statusCode: statusCodes.NOT_FOUND });
    // }

    // if (foundProduct.product_shop.toString() !== products[0]?.shop_id) {
    //   throw new ErrorResponse({ statusCode: statusCodes.NOT_FOUND });
    // }

    // if (!product_quantity) {
    //   return await CartService.deleteItemInCart({
    //     userId,
    //     productId: product_id,
    //   });
    // }

    // return await updateUserCartQuantity({
    //   userId,
    //   product: {
    //     product_id,
    //     product_quantity: product_quantity - old_quantity,
    //   },
    // });
  }

  static async deleteItemInCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" };
    const update = {
      $pull: {
        cart_products: { product_id: productId },
      },
    };

    return await updateModel({
      filter: query,
      payload: update,
      model: cartModel,
    });
  }

  static async getListCart({ userId }) {
    const userCart = await findOneModelByFilter({
      filter: {
        cart_userId: +userId,
        cart_state: "active",
      },
      model: cartModel,
    });

    return userCart;
  }
}

module.exports = CartService;
