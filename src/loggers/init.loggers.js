"use strict";

const winston = require("winston");
require("winston-daily-rotate-file");
const { v4: uuidv4 } = require("uuid");
const { combine, timestamp, align, printf } = winston.format;

class MyLogger {
  constructor() {
    const formatPrint = printf(
      (level, message, context, requestId, timestamp, metadata) => {
        return `${timestamp} [${level}] ${context}::${requestId}::${message} ${
          metadata ? JSON.stringify(metadata) : ""
        }`;
      }
    );

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || "debug",
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        align(),
        formatPrint
      ),
      transports: [
        new winston.transports.Console({
          level: "debug",
          handleExceptions: true,
          json: false,
          colorize: true,
        }),
        new winston.transports.DailyRotateFile({
          level: "info",
          filename: "logs/info-%DATE%.log",
          datePattern: "YYYY-MM-DD HH:mm:ss",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
        }),
        new winston.transports.DailyRotateFile({
          level: "error",
          filename: "logs/error-%DATE%.log",
          datePattern: "YYYY-MM-DD HH:mm:ss",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
          handleExceptions: true,
          json: true,
          colorize: true,
        }),
      ],
      exitOnError: false,
    });
  }

  commonParams(params) {
    let context, req, metadata;
    if (params && !Array.isArray(params)) {
      context = params;
    } else {
      [context, req, metadata] = params;
    }

    const requestId = req?.requestId || uuidv4().toString;

    return { requestId, context, metadata };
  }

  log(message, params) {
    const paramsLog = combineParams(params);
    const logObject = Object.assign({ message }, paramsLog);

    this.logger.info(logObject);
  }

  error(message, params) {
    const paramsLog = combineParams(params);
    const logObject = Object.assign({ message }, paramsLog);

    this.logger.error(logObject);
  }
}

module.exports = new MyLogger();
