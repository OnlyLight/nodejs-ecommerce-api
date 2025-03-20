"use strict";

const notificationModel = require("../models/notification.model");
const { getSelectData } = require("../utils");

class NotificationService {
  async pushNotiToSystem({
    type = "SHOP-001",
    receiveId = 1,
    senderId = 1,
    options = {},
  }) {
    let noti_content;

    if (type == "SHOP-001") {
      noti_content = `Shop ${senderId} has added new product`;
    } else {
      noti_content = `Promotion ${senderId} has been created`;
    }

    const newNoti = await notificationModel.create({
      noti_type: type,
      noti_content,
      noti_senderId: senderId,
      noti_receiveId: receiveId,
      noti_options,
    });

    return newNoti;
  }

  async getNotiByUserId({ userId = 1, type = "ALL" }) {
    const match = { noti_receiveId: userId };

    if (type !== "ALL") {
      match.noti_type = type;
    }

    return await notificationModel.aggregate(
      {
        $match: match,
      },
      {
        $project: getSelectData([
          "noti_type",
          "noti_senderId",
          "noti_receiveId",
          "noti_content",
        ]),
      }
    );
  }
}

module.exports = new NotificationService();
