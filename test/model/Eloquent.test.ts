import 'jest'
import { Eloquent } from '../../lib/model/Eloquent'

describe('Eloquent', function() {
  describe('constructor()', function() {
    it('returns a Proxy instance which wrap Eloquent if the driver.useEloquentProxy() returns true', function() {})

    it('returns an instance of Eloquent if driver.useEloquentProxy() returns false', function() {})
  })

  describe('static register()', function() {
    it('calls najs-binding .register() and create new instance of model', function() {})
  })

  describe('static Mongoose<T>()', function() {
    it('is used for provide static query syntax (the 2nd way)', function() {
      expect(Eloquent.Mongoose() === <any>Eloquent).toBe(true)
    })
  })

  describe('static Class<T>()', function() {
    it('is used for provide static query syntax (the 2nd way)', function() {
      expect(Eloquent.Class() === <any>Eloquent).toBe(true)
    })
  })
})
