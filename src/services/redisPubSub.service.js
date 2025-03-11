"use strict";

const redis = require("redis");

class RedisPubSubService {
  constructor() {
    this.subcription = redis.createClient();
    this.publish = redis.createClient();
  }

  pub(channel, message) {
    return new Promise((resolve, reject) => {
      this.publish(channel, message, (err, reply) => {
        if (err) reject(err);
        resolve(reply);
      });
    });
  }

  sub(channel, callback) {
    this.subcription.subscribe(channel);
    this.subcription.on("message", (ch, message) => {
      if (ch === channel) callback(ch, message);
    });
  }
}

module.exports = new RedisPubSubService();
