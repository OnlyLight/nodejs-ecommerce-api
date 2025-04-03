"use strict";

const { ErrorResponse } = require("../core/error.response");
const { transport } = require("../dbs/init.nodemailer");
const { replacePlaceholder } = require("../utils");
const statusCodes = require("../utils/statusCodes");
const { newOTP } = require("./otp.service");
const { getTemplate } = require("./template.service");

class EmailService {
  async sendEmailLinkVerify({
    html,
    toEmail,
    subject = "Verify Email",
    text = "",
  }) {
    try {
      const mailOptions = {
        from: "your_email@example.com",
        to: toEmail,
        subject,
        text,
        html,
      };

      transport.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Error sending email:", err);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    } catch (error) {
      console.error("Error sending email link verify:", error);
    }
  }

  async sendEmailToken({ email }) {
    try {
      const token = newOTP({ email });

      const template = await getTemplate({
        tem_name: "email_verification",
      });

      if (!template) {
        throw new ErrorResponse({
          message: "Email verification template not found",
          statusCode: statusCodes.NOT_FOUND,
        });
      }

      const content = replacePlaceholder(template.tem_html, {
        link_verify: `http://localhost:3056/shopdev/welcome?token=${token.otp_token}`,
      });

      await this.sendEmailLinkVerify({
        html: content,
        toEmail: email,
        subject: "Verify Email",
        text: "Please verify your email address by clicking the link below:",
      });
    } catch (error) {
      console.error("Error sending email token:", error);
    }
  }
}

module.exports = new EmailService();
