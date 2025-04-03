"use strict";

const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "your_email@gmail.com",
    pass: "your_password",
  },
});

module.exports = {
  transport,
};
