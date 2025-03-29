"use strict";

const { SuccessResponse } = require("../core/success.response");
const statusCodes = require("../utils/statusCodes");
const {
  createRole,
  createResource,
  getAllRoles,
  getAllResources,
} = require("../services/rbac.service");

class RbacController {
  async newRole(req, res, next) {
    const { name, slug, status, grants } = req.body;

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: createRole({
        name,
        slug,
        status,
        grants,
      }),
    }).send(res);
  }

  async newResource(req, res, next) {
    const { name, slug, description } = req.body;

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: createResource({
        name,
        slug,
        description,
      }),
    }).send(res);
  }

  async listRole(req, res, next) {
    const { userId, limit, page, search } = req.body;

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await getAllRoles({ userId, limit, page, search }),
    }).send(res);
  }

  async listResource(req, res, next) {
    const { userId, limit, page, search } = req.body;

    new SuccessResponse({
      statusCode: statusCodes.OK,
      metadata: await getAllResources({ userId, limit, page, search }),
    }).send(res);
  }
}

module.exports = new RbacController();
