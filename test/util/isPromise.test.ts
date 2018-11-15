import 'jest'
import { isPromise } from '../../lib/util/isPromise'

const promise = { then: function() {} }
const asyncResult = async function() {}

describe('isPromise', function() {
  describe('called with a promise', function() {
    it('returns true', function() {
      expect(isPromise(promise)).toBe(true)
    })
  })
  describe('called with a asyncResult', function() {
    it('returns true', function() {
      expect(isPromise(asyncResult())).toBe(true)
    })
  })
  describe('called with null', function() {
    it('returns false', function() {
      // tslint:disable-next-line
      expect(isPromise(null)).toBe(false)
    })
  })
  describe('called with undefined', function() {
    it('returns false', function() {
      expect(isPromise(undefined)).toBe(false)
    })
  })
  describe('called with a number', function() {
    it('returns false', function() {
      expect(isPromise(0)).toBe(false)
      expect(isPromise(-42)).toBe(false)
      expect(isPromise(42)).toBe(false)
    })
  })
  describe('called with a string', function() {
    it('returns false', function() {
      expect(isPromise('')).toBe(false)
      expect(isPromise('then')).toBe(false)
    })
  })
  describe('called with a bool', function() {
    it('returns false', function() {
      expect(isPromise(false)).toBe(false)
      expect(isPromise(true)).toBe(false)
    })
  })
  describe('called with an object', function() {
    it('returns false', function() {
      expect(isPromise({})).toBe(false)
      expect(isPromise({ then: true })).toBe(false)
    })
  })
  describe('called with an array', function() {
    it('returns false', function() {
      expect(isPromise([])).toBe(false)
      expect(isPromise([true])).toBe(false)
    })
  })
})
