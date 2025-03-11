"use strict";

const redisPubSubService = require("../services/redisPubSub.service");

class InventoryServiceTest {
  constructor() {
    redisPubSubService.sub("purchase_events", (channel, message) => {
      this.updateInventory(message);
    });
  }

  updateInventory(productId, quantity) {
    console.log(`Update inventory ${productId} with quantity ${quantity}`);
  }
}

module.exports = new InventoryServiceTest();
