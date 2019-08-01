'use strict';

// const app = require('../server/server');
const { ServiceErrorFactory, ServiceError } = require('../index');

describe('lib error', () => {
  describe('direct constructor', () => {
    test('should be able to call with code', () => {
      const err = new ServiceError('1234');
      expect(err.code).toBe('1234');
    });
    test('should be able to call with code and msg', () => {
      const err = new ServiceError('1234', 'msg');
      expect(err.code).toBe('1234');
      expect(err.message).toBe('msg');
    });
    test('should be able to call with code, msg and extra', () => {
      const err = new ServiceError('1234', 'msg', { foo: 'bar' });
      expect(err.code).toBe('1234');
      expect(err.message).toBe('msg');
      expect(err.foo).toBe('bar');
    });
    test('should be able to create with ServiceError instance', () => {
      const err = new ServiceError('1234', 'msg', { foo: 'bar' });
      const err2 = new ServiceError(err);
      expect(err2.code).toBe('1234');
      expect(err2.message).toBe('msg');
      expect(err2.foo).toBe('bar');
    });
  });
  describe('factory', () => {
    test('should be able to call without logger', () => {
      const builder = ServiceErrorFactory();
      const err = builder('1234', 'msg');
      expect(err.code).toBe('1234');
      expect(err.message).toBe('msg');
    });
    test('should be able to call with code and msg', () => {
      const logger = { error: jest.fn() };
      const builder = ServiceErrorFactory(logger);
      const err = builder('1234', 'msg2');
      expect(err.code).toBe('1234');
      expect(err.message).toBe('msg2');
      expect(logger.error.mock.calls).toHaveLength(1);
      expect(logger.error.mock.calls[0][0]).toEqual({
        code: '1234',
        message: 'msg2'
      });
    });
    test('should be able to call with code msg and extra', () => {
      const logger = { error: jest.fn() };
      const builder = ServiceErrorFactory(logger);
      const err = builder('1234', 'msg2', { foo: 'bar' });
      expect(err.code).toBe('1234');
      expect(err.message).toBe('msg2');
      expect(logger.error.mock.calls).toHaveLength(1);
      expect(logger.error.mock.calls[0][0]).toEqual({
        code: '1234',
        message: 'msg2',
        foo: 'bar'
      });
    });
    test('should have the correct stack', () => {
      const logger = { error: jest.fn() };
      const builder = ServiceErrorFactory(logger);
      const err = builder('1234', 'msg2', { foo: 'bar' });
      expect(err.code).toBe('1234');
      expect(err.message).toBe('msg2');
      expect(logger.error.mock.calls).toHaveLength(1);
      expect(err.stack).not.toMatch('lib/error.js');
    });
    test('should be able to create with Factory from another ServiceError instance', () => {
      const err = new ServiceError('1234', 'msg', { foo: 'bar' });
      const logger = { error: jest.fn() };
      const builder = ServiceErrorFactory(logger);
      const err2 = builder(err);
      expect(err2.code).toBe('1234');
      expect(err2.message).toBe('msg');
      expect(err2.foo).toBe('bar');
      expect(logger.error.mock.calls).toHaveLength(1);
      expect(logger.error.mock.calls[0][0]).toEqual({
        code: '1234',
        message: 'msg',
        foo: 'bar'
      });
    });
    test('should be able to attach extra to the wrapper error', () => {
      const err = new ServiceError('1234', 'msg', { foo: 'bar' });
      const logger = { error: jest.fn() };
      const builder = ServiceErrorFactory(logger);
      const err2 = builder(err, { qux: 1 });
      expect(err2.code).toBe('1234');
      expect(err2.message).toBe('msg');
      expect(err2.foo).toBe('bar');
      expect(err2.qux).toBe(1);
      expect(logger.error.mock.calls).toHaveLength(1);
      expect(logger.error.mock.calls[0][0]).toEqual({
        code: '1234',
        message: 'msg',
        foo: 'bar',
        qux: 1
      });
    });
  });
});
