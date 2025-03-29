const AccessControl = require("accesscontrol");

// let grantList = [
//   {
//     role: "admin",
//     resource: "profile",
//     actions: ["read:any"],
//     attributes: "*, !views",
//   },
//   { role: "shop", resource: "profile", actions: ["read:own"], attributes: "*" },
// ];

module.exports = new AccessControl();
