import 'jest'
import { Record } from '../../lib/drivers/Record'

describe('Record', function() {
  describe('constructor()', function() {
    it('always initials property .data and .modified', function() {
      const record = new Record()
      expect(record['data']).toEqual({})
      expect(record['modified']).toEqual([])
    })

    it('assigns to data if the first argument is an object', function() {
      const data = {}
      const record = new Record(data)
      expect(record['data'] === data).toBe(true)
      expect(record['modified']).toEqual([])
    })

    it('copies record.data if the first argument is an Record instance', function() {
      const data = {}
      const copy = new Record(data)
      const record = new Record(copy)
      expect(record['data'] === data).toBe(true)
      expect(record === copy).toBe(false)
    })
  })

  describe('.getAttribute()', function() {
    it('uses Lodash.get() to receive a value at path', function() {
      const record = new Record({ a: 'a', b: { c: 1, d: 2 } })
      expect(record.getAttribute('a')).toEqual('a')
      expect(record.getAttribute('b.c')).toEqual(1)
      expect(record.getAttribute('b.d')).toEqual(2)
      expect(record.getAttribute('not-found')).toBe(undefined)
    })
  })

  describe('.setAttribute()', function() {
    it('uses Lodash.set() to set value, always returns true', function() {
      const record = new Record()
      expect(record.setAttribute('a', '1')).toBe(true)
      expect(record.setAttribute('b.c', 'c')).toBe(true)
      expect(record.toObject()).toEqual({ a: '1', b: { c: 'c' } })
    })

    it('compares current value of put the path into .modified if value get changed', function() {
      const record = new Record()
      expect(record.getModified()).toEqual([])
      record.setAttribute('a', 'a')
      expect(record.getModified()).toEqual(['a'])
      record.setAttribute('a', 'b')
      expect(record.getModified()).toEqual(['a'])
      record.setAttribute('a', 'a')
      expect(record.getModified()).toEqual(['a'])

      const recordWithData = new Record({ a: 'a', b: { c: 1 } })
      expect(recordWithData.getModified()).toEqual([])
      recordWithData.setAttribute('a', 'a')
      expect(recordWithData.getModified()).toEqual([])
      recordWithData.setAttribute('b', { c: 1 })
      expect(recordWithData.getModified()).toEqual([])
      recordWithData.setAttribute('b', 2)
      expect(recordWithData.getModified()).toEqual(['b'])
    })
  })

  describe('.getModified()', function() {
    it('simply returns property .modified', function() {
      const modified: string[] = []
      const record = new Record()
      record['modified'] = modified
      expect(record.getModified() === modified).toBe(true)
    })
  })

  describe('.clearModified()', function() {
    it('simply clears property .modified', function() {
      const modified: string[] = ['a', 'b', 'c']
      const record = new Record()
      record['modified'] = modified
      expect(record.clearModified() === record).toBe(true)
      expect(record.getModified()).toEqual([])
    })
  })

  describe('.markModified()', function() {
    it('push path into property .modified if it not contains path yet, otherwise do nothing', function() {
      const record = new Record()
      record.markModified('a')
      expect(record.getModified()).toEqual(['a'])
      record.markModified('b')
      expect(record.getModified()).toEqual(['a', 'b'])
      record.markModified('b')
      expect(record.getModified()).toEqual(['a', 'b'])
    })
  })

  describe('.toObject()', function() {
    it('simply return property .data', function() {
      const data = {}
      const record = new Record(data)
      expect(record.toObject() === data).toBe(true)
    })
  })
})
