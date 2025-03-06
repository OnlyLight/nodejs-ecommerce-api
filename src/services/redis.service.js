"use strict";

const redis = require("redis");
const { promisify } = require("util");
const { reservationInventory } = require("../repositories/inventory.repo");
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId, productQuantity, cartId) => {
  const lockKey = `lock_v2025_:${productId}`;
  const retryTime = 10;
  const expireTime = 3000;

  for (let i = 0; i < retryTime.length; i++) {
    const result = await setnxAsync(lockKey, expireTime);

    if (result === 1) {
      const isReservation = await reservationInventory({
        productId,
        productQuantity,
        cartId,
      });

      if (isReservation.modifiedCount) {
        await pexpire(lockKey, expireTime);
        return lockKey;
      }

      return false;
    }

    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};

const releaseLock = async (lockKey) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(lockKey);
};

module.exports = {
  acquireLock,
  releaseLock,
};
