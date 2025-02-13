"use strict";

const _ = require("lodash");

const getInfoDta = ({ object = {}, fields = [] }) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  // return Object.fromEntries(select.map(el => [el, 1]))
  return _.mapValues(_.keyBy(select), () => 1);
};

const getUnSelectData = (select = []) => {
  return _.mapValues(_.keyBy(select), () => 0);
};

const deepClean = (obj) => {
  // Object.keys(obj).forEach((key) => {
  //   if (obj[key] === undefined || obj[key] === null) {
  //     delete obj[key];
  //   }
  // });
  // return obj;
  // return _.omitBy(obj, _.isNull);
  return _.omitBy(
    _.mapValues(obj, (v) => {
      return _.isObject(v) ? deepClean(v) : v;
    }),
    _.isNil
  );
};

const updateModel = async ({
  filter,
  payload,
  model,
  isNew = true,
  isUpsert = false,
}) => {
  return await model.findOneAndUpdate(filter, payload, {
    new: isNew,
    upsert: isUpsert,
  });
};

const findAllInModel = async ({ filter, model, limit, sort, page, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  const result = await model
    .find(filter)
    .select(select)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .lean();

  return result;
};

const findOneModelById = async ({ id, select, model }) => {
  return await model.findById(id).select(select).lean();
};

//**
// use for update key in mongoose object
// if update by put the object => it will replace the existing by the new object
// Example: product_attributes: { model: "model 1", manufacturer: "ma 1" }. update manufacturer: "ma 2"
// 1. DONT USE fuc Parser: => product_attributes: { manufacturer: 'manufacturer 1' } => replace to new object
// 2. USE func Parser: => 'product_attributes.manufacturer': 'manufacturer 2' => just change the key to 'manufacturer' into obj existing
// */

const updateNestedObjectParser = (obj) => {
  const final = {};

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const res = updateNestedObjectParser(obj[key]);
      Object.keys(res).forEach((resKey) => {
        final[`${key}.${resKey}`] = res[resKey];
      });
    } else {
      final[key] = obj[key];
    }
  });

  return final;
};

module.exports = {
  getInfoDta,
  getSelectData,
  getUnSelectData,
  findAllInModel,
  findOneModelById,
  deepClean,
  updateModel,
  updateNestedObjectParser,
};
