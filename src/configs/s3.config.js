"use strict";

const { S3Client } = require("@aws-sdk/client-s3");

const s3Config = {
  region: "us-west-2",
  credentials: {
    accessKeyId: "YOUR_ACCESS_KEY",
    secretAccessKey: "YOUR_SECRET_KEY",
  },
};

const s3 = new S3Client(s3Config);

module.exports = {
  s3,
};
