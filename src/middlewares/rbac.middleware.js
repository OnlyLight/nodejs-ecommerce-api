"use strict";

const { ErrorResponse } = require("../core/error.response");
const { getAllRoles } = require("../services/rbac.service");
const statusCodes = require("../utils/statusCodes");
const rbac = require("./role.middleware");

const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      rbac.setGrants(
        await getAllRoles({
          userId: 0,
        })
      );
      const rol_name = req.query.role;
      const permissions = rbac.can(rol_name)[action][resource];

      if (!permissions.granted) {
        throw new ErrorResponse({
          statusCode: statusCodes.UNAUTHORIZED,
          message: "Permission denied",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  grantAccess,
};
