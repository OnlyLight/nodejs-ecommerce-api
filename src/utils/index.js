'use strict'

const _ = require('lodash')

const getInfoDta = ({ object = {}, fields = [] }) => {
  return _.pick(object, fields)
}

module.exports = {
  getInfoDta
}