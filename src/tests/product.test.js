"use strict";

const redisPubSubService = require("../services/redisPubSub.service");

class ProductServiceTest {
  purchaseProduct(productId, quantity) {
    redisPubSubService.pub(
      "purchase_events",
      JSON.stringify({ productId, quantity })
    );
  }
}

module.exports = new ProductServiceTest();
