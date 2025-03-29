"use strict";

const { ErrorResponse } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromS3,
} = require("../services/upload.service");
const statusCodes = require("../utils/statusCodes");

class UploadController {
  async uploadFile(req, res) {
    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await uploadImageFromUrl(),
    }).send(res);
  }

  async uploadFileThumb(req, res) {
    if (!req.file) {
      return new ErrorResponse({ statusCode: statusCodes.BAD_REQUEST });
    }

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await uploadImageFromLocal({
        path: req.file.path,
      }),
    }).send(res);
  }

  async uploadFileS3(req, res) {
    if (!req.file) {
      return new ErrorResponse({ statusCode: statusCodes.BAD_REQUEST });
    }

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await uploadImageFromS3({
        path: req.file.path,
      }),
    }).send(res);
  }
}

module.exports = new UploadController();
