"use strict";

const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const cloudinary = require("../configs/cloudinary.config");
const { s3 } = require("../configs/s3.config");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const uploadImageFromS3 = async ({ file }) => {
  try {
    const command = new PutObjectCommand({
      Bucket: "YOUR_BUCKET",
      Key: `${file.originalname}-${Date.now()}` || "unknown",
      Body: file.buffer,
      ContentType: "image/jpeg",
    });

    const result = await s3.send(command);
    const signedUrl = new GetObjectCommand({
      Bucket: "YOUR_BUCKET",
      Key: `${file.originalname}-${Date.now()}` || "unknown",
    });
    const url = await getSignedUrl(s3, signedUrl, { expiresIn: 3600 });

    return {
      result,
      url,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return false;
  }
};

const uploadImageFromUrl = async () => {
  try {
    const urlImage = "";
    const folderName = "product/shopId";
    const fileName = "image.jpg";

    const result = await cloudinary.uploader.upload(urlImage, {
      folder: folderName,
      public_id: fileName,
    });

    return result;
  } catch (error) {
    console.error("Error uploading image:", error);
    return false;
  }
};

const uploadImageFromLocal = async ({ path, folderName = "product/1111" }) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      folder: folderName,
      public_id: "thumb",
    });

    return {
      image_url: result.secure_url,
      shopId: 1111,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return false;
  }
};

module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromS3,
};
