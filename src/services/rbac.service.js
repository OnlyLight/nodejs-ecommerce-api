"use strict";

const resourceModel = require("../models/resource.model");
const roleModel = require("../models/role.model");

class rbacService {
  async createResource({ name = "profile", slug = "p0001", description = "" }) {
    try {
      const resource = await resourceModel.create({
        src_name: name,
        src_slug: slug,
        src_description: description,
      });

      return resource;
    } catch (error) {
      return error.message;
    }
  }

  async getAllResources({ userId, limit = 30, page = 1, search = "" }) {
    try {
      const resource = await resourceModel.aggregate({
        $project: {
          _id: 0,
          name: "$src_name",
          slug: "$src_slug",
          description: "$src_description",
          resourcesId: "$_id",
          createdAt: 1,
        },
      });

      return resource;
    } catch (error) {
      return error.message;
    }
  }

  async createRole({
    name = "shop",
    slug = "s0001",
    status = "active",
    grants = [],
  }) {
    try {
      const role = await roleModel.create({
        rol_name: name,
        rol_slug: slug,
        rol_status: status,
        rol_grants: grants,
      });

      return role;
    } catch (error) {
      return error.message;
    }
  }

  async getAllRoles({ userId, limit = 30, page = 1, search = "" }) {
    try {
      const roles = await roleModel.aggregate([
        {
          $unwind: "$rol_grants",
        },
        {
          $lookup: {
            from: "Resources",
            localField: "rol_grants.resource",
            foreignField: "_id",
            as: "resource",
          },
        },
        {
          $unwind: "$resource",
        },
        {
          $project: {
            role: "$rol_name",
            resource: "$resource.src_name",
            actions: "rol_grants.actions",
            attributes: "$rol_grants.attributes",
          },
        },
        {
          $unwind: "$actions",
        },
        {
          $project: {
            role: 1,
            resource: 1,
            actions: "$actions",
            attributes: 1,
          },
        },
      ]);
      return roles;
    } catch (error) {
      return error.message;
    }
  }
}

module.exports = new rbacService();
