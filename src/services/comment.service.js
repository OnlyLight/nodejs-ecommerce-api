"use strict";

const { Types } = require("mongoose");
const { ErrorResponse } = require("../core/error.response");
const commentModel = require("../models/comment.model");
const {
  findOneModelByFilter,
  updateModel,
  findAllInModel,
  getSelectData,
} = require("../utils");
const statusCodes = require("../utils/statusCodes");

//
// addComment [User, Shop]
// getList of Comments [User, Shop]
// delete comment [User | Shop | Admin]
// */
class CommentService {
  async createComment({ productId, userId, content, parentCommentId = null }) {
    const comment = new commentModel({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentCommentId: parentCommentId,
    });

    let right;
    if (!parentCommentId) {
      const maxRight = await findOneModelByFilter({
        model: commentModel,
        filter:
          ({ comment_productId: productId },
          "comment_right",
          { sort: { comment_right: -1 } }),
        isLean: false,
      });

      if (maxRight) {
        right = maxRight.comment_right + 1;
      } else {
        right = 1;
      }
    } else {
      const parentComment = await findOneModelByFilter({
        model: commentModel,
        filter: { _id: parentCommentId },
        isLean: false,
      });

      if (!parentComment) {
        throw new ErrorResponse({
          message: "Parent comment not found",
          statusCode: statusCodes.NOT_FOUND,
        });
      }

      right = parentComment.comment_right;

      await updateModel({
        model: commentModel,
        filter: {
          comment_productId: new Types.ObjectId(productId),
          comment_right: { $gte: right },
        },
        payload: { $inc: { comment_right: 2 } },
      });

      await updateModel({
        model: commentModel,
        filter: {
          comment_productId: new Types.ObjectId(productId),
          comment_left: { $gt: right },
        },
        payload: { $inc: { comment_left: 2 } },
      });
    }

    comment.comment_left = right;
    comment.comment_right = right + 1;

    await comment.save();
    return comment;
  }

  async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    page = 1,
  }) {
    if (parentCommentId) {
      const parent = await findOneModelByFilter({
        model: commentModel,
        filter: { _id: parentCommentId },
        isLean: false,
      });

      if (!parent) {
        throw new ErrorResponse({
          message: "Parent comment not found",
          statusCode: statusCodes.NOT_FOUND,
        });
      }

      // nested comments
      const comments = await findAllInModel({
        model: commentModel,
        filter: {
          comment_productId: new Types.ObjectId(productId),
          comment_left: { $gt: parent.comment_left },
          comment_right: { $lte: parent.comment_right },
        },
        sort: { comment_left: 1 },
        select: getSelectData([
          "comment_left",
          "comment_right",
          "comment_parent",
        ]),
        page,
        limit,
      });

      return comments;
    }

    // root comment
    const comments = await findAllInModel({
      model: commentModel,
      filter: {
        comment_productId: new Types.ObjectId(productId),
        comment_parentCommentId: parentCommentId,
      },
      sort: { comment_left: 1 },
      select: getSelectData([
        "comment_left",
        "comment_right",
        "comment_parent",
      ]),
      page,
      limit,
    });

    return comments;
  }
}

module.exports = new CommentService();
