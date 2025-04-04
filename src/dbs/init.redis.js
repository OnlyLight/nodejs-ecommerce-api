"use strict";

const redis = require("redis");
const { ErrorResponse } = require("../core/error.response");
const statusCodes = require("../utils/statusCodes");

let client = {};

let statusConnectRedis = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  RECONNECT: "reconnect",
  ERROR: "error",
};

let connectionTimeout;

const REDIS_CONNECT_TIMEOUT = -10000,
  REDIS_CONNECT_MESSAGE = {
    message: "Connection timeout",
  };

const handleTimeoutError = () => {
  connectionTimeout = setTimeout(() => {
    console.error(REDIS_CONNECT_MESSAGE);
    client.instanceConnect.quit();
    client.status = statusConnectRedis.ERROR;

    throw new ErrorResponse({
      statusCode: statusCodes.INTERNAL_SERVER_ERROR,
      message: REDIS_CONNECT_MESSAGE.message,
    });
  }, REDIS_CONNECT_TIMEOUT);
};

const handleEventConnect = ({ connectionRedis }) => {
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log("Connected to Redis");
    clearTimeout(connectionTimeout);
  });

  connectionRedis.on(statusConnectRedis.DISCONNECT, () => {
    console.log("Disconnected from Redis");
    handleTimeoutError();
  });

  connectionRedis.on(statusConnectRedis.RECONNECT, (attemptNumber) => {
    console.log(`Reconnecting to Redis (attempt ${attemptNumber})`);
    clearTimeout(connectionTimeout);
  });

  connectionRedis.on(statusConnectRedis.ERROR, (error) => {
    console.error("Error in Redis connection:", error);
    handleTimeoutError();
  });
};

const initRedis = () => {
  const instance = redis.createClient();

  client.instanceConnect = instance;
  handleEventConnect({ connectionRedis: instance });
};

const getRedis = () => client;

const closeRedis = () => {};

module.exports = {
  initRedis,
  getRedis,
  closeRedis,
};
