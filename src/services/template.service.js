"use strict";

const templateModel = require("../models/template.model");
const { findOneModelByFilter } = require("../utils");
const { temHtmlEmail } = require("../utils/tem.html");

class TemplateService {
  async newTemplate({ tem_name, tem_html }) {
    const newTemplate = await templateModel.create({
      tem_name,
      tem_html: temHtmlEmail(),
    });

    return newTemplate;
  }

  async getTemplate({ tem_name }) {
    const template = await findOneModelByFilter({
      model: templateModel,
      filter: { tem_name },
    });

    return template;
  }
}

module.exports = new TemplateService();
