'use strict'

const _ = require('lodash')

const getInfoDta = ({ object = {}, fields = [] }) => {
  return _.pick(object, fields)
}

const getSelectData = (select = []) => {
  // return Object.fromEntries(select.map(el => [el, 1]))
  return _.mapValues(_.keyBy(select), () => 1)
}

const getUnSelectData = (select = []) => {
  return _.mapValues(_.keyBy(select), () => 0)
}

const updateModel = async ({ filter, payload, model, isNew = true, isUpsert = false }) => {
  return await model.findOneAndUpdate(
    filter,
    payload,
    { new: isNew, upsert: isUpsert }
  )
}

module.exports = {
  getInfoDta,
  getSelectData,
  getUnSelectData,
  updateModel
}