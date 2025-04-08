"use strict";

const { ErrorResponse } = require("../core/error.response");
const { getRedis } = require("../dbs/init.ioredis");
const statusCodes = require("../utils/statusCodes");
const redisCache = getRedis().instanceConnect;

const setCacheIORedis = async ({ key, value }) => {
  if (!redisCache) {
    throw new ErrorResponse({
      statusCode: statusCodes.INTERNAL_SERVER_ERROR,
      message: "Redis is not connected",
    });
  }

  try {
    return await redisCache.set(key, value);
  } catch (error) {
    throw new ErrorResponse({
      statusCode: statusCodes.INTERNAL_SERVER_ERROR,
      message: "Error setting cache using Redis",
    });
  }
};

const setCacheIOExpiration = async ({ key, value, expirationInSeconds }) => {
  if (!redisCache) {
    throw new ErrorResponse({
      statusCode: statusCodes.INTERNAL_SERVER_ERROR,
      message: "Redis is not connected",
    });
  }

  try {
    return await redisCache.set(key, value, "EX", expirationInSeconds);
  } catch (error) {
    throw new ErrorResponse({
      statusCode: statusCodes.INTERNAL_SERVER_ERROR,
      message: "Error setting cache using Redis",
    });
  }
};

const getCacheIO = async ({ key }) => {
  if (!redisCache) {
    throw new ErrorResponse({
      statusCode: statusCodes.INTERNAL_SERVER_ERROR,
      message: "Redis is not connected",
    });
  }

  try {
    return await redisCache.get(key);
  } catch (error) {
    throw new ErrorResponse({
      statusCode: statusCodes.INTERNAL_SERVER_ERROR,
      message: "Error setting cache using Redis",
    });
  }
};

module.exports = {
  setCacheIORedis,
  setCacheIOExpiration,
  getCacheIO,
};
