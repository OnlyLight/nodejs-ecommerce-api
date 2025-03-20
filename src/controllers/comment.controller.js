"use strict";

const { SuccessResponse } = require("../core/success.response");
const {
  createComment,
  getCommentsByParentId,
  deleteComments,
} = require("../services/comment.service");
const statusCodes = require("../utils/statusCodes");

class CommentController {
  async createComment(req, res) {
    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await createComment({
        userId: req.query.userId,
        productId: req.query.productId,
        parentCommentId: req.body.parentCommentId,
        content: req.body.content,
      }),
    }).send(res);
  }

  async getCommentsByParentId(req, res) {
    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await getCommentsByParentId({
        productId: req.query.productId,
        parentCommentId: req.query.parentCommentId,
        limit: parseInt(req.query.limit),
        page: parseInt(req.query.page),
      }),
    }).send(res);
  }

  async deleteComments(req, res) {
    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await deleteComments({
        userId: req.query.userId,
        productId: req.query.productId,
        commentId: req.query.commentId,
      }),
    }).send(res);
  }
}

module.exports = new CommentController();
