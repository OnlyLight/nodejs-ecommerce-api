"use strict";

const { Types } = require("mongoose");
const cartModel = require("../models/cart.model");
const { findOneModelByFilter } = require("../utils");
const { ErrorResponse } = require("../core/error.response");
const statusCodes = require("../utils/statusCodes");
const { checkProductByServer } = require("../repositories/product.repo");
const { getDiscountAmount } = require("../repositories/discount.repo");
const { acquireLock, releaseLock } = require("./redis.service");
const orderModel = require("../models/order.model");

class CheckoutService {
  static async checkoutReview({ cartId, userId, products }) {
    const foundCart = await findOneModelByFilter({
      filter: {
        _id: new Types.ObjectId(cartId),
        cart_state: "active",
      },
      model: cartModel,
    });

    if (!foundCart) {
      throw new ErrorResponse({
        message: "Cart not found or is not active",
        statusCode: statusCodes.BAD_REQUEST,
      });
    }

    const checkoutOrder = {
      totalPrice: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };

    const shop_order_ids = await Promise.all(
      products.map(
        async ({ shop_id, shop_discounts = [], item_products = [] }) => {
          const checkProductServer = await checkProductByServer(item_products);

          if (!checkProductServer[0]) {
            throw new ErrorResponse({
              message: "Some products not found in server",
              statusCode: statusCodes.BAD_REQUEST,
            });
          }

          if (shop_discounts.length > 0) {
            const discountResult = await Promise.all(
              shop_discounts.map(async (code) => {
                return await getDiscountAmount({
                  code: code.discount_code,
                  userId,
                  shopId: shop_id,
                  products: item_products,
                });
              })
            );

            discountResult.forEach(({ discount, totalPrice, totalOrder }) => {
              checkoutOrder.totalDiscount += discount;
              checkoutOrder.totalPrice += totalOrder;
              checkoutOrder.totalCheckout += totalPrice;
            });

            return {
              shop_id,
              shop_discounts,
              price_raw: checkoutOrder.totalPrice,
              price_apply_discount: checkoutOrder.totalCheckout,
              item_products,
            };
          }
        }
      )
    );

    // for (let i = 0; i < products.length; i++) {
    //   const { shop_id, shop_discounts = [], item_products = [] } = products[i];

    //   const checkProductServer = await checkProductByServer(item_products);

    //   if (!checkProductServer[0]) {
    //     throw new ErrorResponse({
    //       message: "Some products not found in server",
    //       statusCode: statusCodes.BAD_REQUEST,
    //     });
    //   }

    //   if (shop_discounts.length > 0) {
    //     const discountResult = await Promise.all(
    //       shop_discounts.map(async (code) => {
    //         return await getDiscountAmount({
    //           code: code.discount_code,
    //           userId,
    //           shopId: shop_id,
    //           products: item_products,
    //         });
    //       })
    //     );

    //     discountResult.forEach(({ discount, totalPrice, totalOrder }) => {
    //       checkoutOrder.totalDiscount += discount;
    //       checkoutOrder.totalPrice += totalOrder;
    //       checkoutOrder.totalCheckout += totalPrice;
    //     });

    //     // for (let code of shop_discounts) {
    //     //   const { discount, totalPrice, totalOrder } = await getDiscountAmount({
    //     //     code: code,
    //     //     userId,
    //     //     shopId: shop_id,
    //     //     products: item_products,
    //     //   });

    //     //   checkoutOrder.totalDiscount += discount;
    //     //   checkoutOrder.totalPrice += totalOrder;
    //     //   checkoutOrder.totalCheckout += totalPrice;
    //     // }

    //     shop_order_ids.push({
    //       shop_id,
    //       shop_discounts,
    //       price_raw: checkoutOrder.totalPrice,
    //       price_apply_discount: checkoutOrder.totalCheckout,
    //       item_products,
    //     });
    //   }
    // }

    return {
      shop_order_ids,
      checkout_order: checkoutOrder,
    };
  }

  static async orderByUser({
    products,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const {
      shop_order_ids,
      checkout_order,
    } = await CheckoutService.checkoutReviews({
      cartId,
      userId,
      products,
    });

    const listProducts = shop_order_ids.flatMap((order) => order.item_products);

    const acquireProduct = [];
    listProducts.forEach(async ({ product_id, product_quantity }) => {
      const lockKey = await acquireLock(product_id, product_quantity, cartId);
      acquireProduct.push(lockKey);

      if (!lockKey) {
        throw new ErrorResponse({
          message: "Product out of stock",
          statusCode: statusCodes.CONFLICT,
        });
      }

      await releaseLock(lockKey);
    });

    if (acquireProduct.includes(false)) {
      throw new ErrorResponse({
        message: "Some products updated already",
        statusCode: statusCodes.BAD_REQUEST,
      });
    }

    const newOrder = orderModel.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids,
    });
    // return newOrder
  }
}

module.exports = CheckoutService;
