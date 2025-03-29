"use strict";

// Require the cloudinary library
const cloudinary = require("cloudinary").v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name: "your_cloud_name",
  api_key: "your_api_key",
  api_secret: "your_api_secret",
  secure: true,
});

// Log the configuration
console.log(cloudinary.config());

module.exports = cloudinary;
