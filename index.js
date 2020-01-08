'use strict';

const ExtendableError = require('es6-error');

class ServiceError extends ExtendableError {
  constructor(code, msg, extra = {}, logger) {
    // if second param is Error object, retrieve it's message
    if (msg instanceof Error) {
      msg = msg.message;
    }
    if (code instanceof ServiceError) {
      const instance = code;
      if (typeof msg !== 'string') {
        extra = msg;
      }
      msg = instance.message;
      extra = { ...instance, ...extra };
      code = instance.code;
    }
    super(msg);
    this.code = code;
    Object.assign(this, extra);
    if (logger && logger.error) {
      logger.error({
        ...extra,
        code: this.code,
        message: msg
      });
    }
  }
}

function ServiceErrorFactory(logger) {
  return function fn(...args) {
    while (args.length < 3) {
      args.push({});
    }
    const err = new ServiceError(...args, logger);
    // fn is the wrapper function which is the frame above new ServiceError, omit it
    if (Error.hasOwnProperty('captureStackTrace')) {
      Error.captureStackTrace(err, fn);
    }
    return err;
  };
}

module.exports = {
  ServiceError,
  ServiceErrorFactory
};
