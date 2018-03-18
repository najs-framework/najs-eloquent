import 'jest'
import { DummyDriver } from '../../lib/drivers/DummyDriver'

describe('DummyDriver', function() {
  describe('.initialize()', function() {
    it('assigns data to attributes', function() {
      const attributes = { a: 'test' }
      const dummy = new DummyDriver()
      dummy.initialize(attributes)
      expect(dummy.attributes === attributes).toBe(true)

      const empty = new DummyDriver()
      empty.initialize()
      expect(empty.attributes).toEqual({})
    })
  })

  describe('.getAttribute()', function() {
    it('returns attributes[name]', function() {
      const attributes = { a: 'test' }
      const dummy = new DummyDriver()
      dummy.initialize(attributes)
      expect(dummy.getAttribute('a')).toEqual('test')
    })
  })

  describe('.setAttribute()', function() {
    it('calls attributes[name]', function() {
      const attributes = {}
      const dummy = new DummyDriver()
      dummy.initialize(attributes)
      dummy.setAttribute('a', 'test')
      expect(dummy.attributes).toEqual({ a: 'test' })
    })
  })

  describe('.getId()', function() {
    it('returns id in attributes variable', function() {
      const attributes = {
        id: 'test'
      }
      const dummy = new DummyDriver()
      dummy.initialize(attributes)
      expect(dummy.getId()).toEqual('test')
    })
  })

  describe('.setId()', function() {
    it('sets id to attributes variable', function() {
      const attributes = {}
      const dummy = new DummyDriver()
      dummy.initialize(attributes)
      dummy.setId('test')
      expect(dummy.attributes).toEqual({ id: 'test' })
    })
  })

  describe('.newQuery()', function() {
    it('returns empty object', function() {
      const dummy = new DummyDriver()
      expect(dummy.newQuery()).toEqual({})
    })
  })

  describe('.toObject()', function() {
    it('returns attributes', function() {
      const attributes = {}
      const dummy = new DummyDriver()
      dummy.initialize(attributes)
      expect(dummy.toObject() === dummy.attributes).toBe(true)
    })
  })

  describe('.toJSON()', function() {
    it('returns attributes', function() {
      const attributes = {}
      const dummy = new DummyDriver()
      dummy.initialize(attributes)
      expect(dummy.toJSON() === dummy.attributes).toBe(true)
    })
  })

  describe('.is()', function() {
    it('returns true if id in attribute is equal', function() {
      const attributes = { id: 'test' }
      const dummy = new DummyDriver()
      dummy.initialize(attributes)

      const comparedDriver = new DummyDriver()
      comparedDriver.initialize({ id: 'test' })
      const model = { driver: comparedDriver }

      expect(dummy.is(<any>model)).toBe(true)
    })
  })
})
