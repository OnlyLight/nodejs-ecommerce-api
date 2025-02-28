"use strict";

const { default: mongoose } = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 5000;

const countConnect = () => {
  const numConnection = mongoose.connection.base.connections.length;
  console.log(`Number of connections::${numConnection}`);
};

const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    const maxConnections = numCores * 5;
    if (maxConnections < numConnection)
      console.log("Connection overload dectected!");
  }, _SECONDS); // 5000 milisecond
};

module.exports = {
  countConnect,
  checkOverload,
};
