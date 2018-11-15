import 'jest'
import * as Sinon from 'sinon'
import { pick } from 'lodash'
import { DataBuffer } from '../../lib/data/DataBuffer'
import { DataCollector } from '../../lib/data/DataCollector'

const reader = {
  getAttribute(data: object, field: string) {
    return data[field]
  },

  pick(data: object, fields: string[]) {
    return pick(data, fields)
  },

  toComparable(value: any) {
    return value
  }
}
describe('DataBuffer', function() {
  describe('constructor()', function() {
    it('assigns modelName and primaryKeyName to respective properties and create new buffer as a Map', function() {
      const dataBuffer = new DataBuffer('id', reader)
      expect(dataBuffer.getPrimaryKeyName()).toEqual('id')
      expect(dataBuffer.getDataReader() === reader).toBe(true)
    })
  })

  describe('.getDataReader()', function() {
    it('simply returns the reader which is used by the buffer', function() {
      const dataBuffer = new DataBuffer('id', reader)
      expect(dataBuffer.getPrimaryKeyName()).toEqual('id')
      expect(dataBuffer.getDataReader() === reader).toBe(true)
    })
  })

  describe('.add()', function() {
    it('is chainable, simply assigns the record to map with id from reader.getAttribute(primaryKey)', function() {
      const dataBuffer = new DataBuffer('id', reader)

      const record = { id: 1 }
      const stub = Sinon.stub(reader, 'getAttribute')
      stub.returns('anything')

      expect(dataBuffer.add(record) === dataBuffer).toBe(true)
      expect(dataBuffer.getBuffer().get('anything') === record).toBe(true)

      stub.restore()
    })
  })

  describe('.remove()', function() {
    it('is chainable, simply removes the record out of map with id from .getPrimaryKey()', function() {
      const dataBuffer = new DataBuffer('id', reader)

      const record = { id: 1 }
      const stub = Sinon.stub(reader, 'getAttribute')
      stub.returns('anything')
      dataBuffer.add(record)

      expect(dataBuffer.remove(record) === dataBuffer).toBe(true)
      expect(dataBuffer.getBuffer().get('anything')).toBeUndefined()

      stub.restore()
    })
  })

  describe('.find()', function() {
    it('converts buffer.values() to array then apply Array.find() with callback', function() {
      const dataBuffer = new DataBuffer('id', reader)
      const a = { id: 1, name: 'a' }
      const b = { id: 2, name: 'b' }
      const c = { id: 3, name: 'c' }
      const d = { id: 4, name: 'd' }

      dataBuffer
        .add(a)
        .add(b)
        .add(c)
        .add(d)

      const resultOne = dataBuffer.find(item => ['b', 'c'].indexOf(item['name']) !== -1)
      const resultTwo = dataBuffer.find(item => ['a', 'd'].indexOf(item['name']) !== -1)
      const resultThree = dataBuffer.find(item => ['a', 'd'].indexOf(item['name']) !== -1)
      const resultFour = dataBuffer.find(item => ['x'].indexOf(item['name']) !== -1)

      expect(resultOne).toEqual(b)
      expect(resultTwo).toEqual(a)
      expect(resultThree).toEqual(a)
      expect(resultTwo === resultThree).toBe(true)
      expect(resultFour).toBeUndefined()
    })
  })

  describe('.filter()', function() {
    it('converts buffer.values() to array then apply Array.filter() with callback', function() {
      const dataBuffer = new DataBuffer('id', reader)
      const a = { id: 1, name: 'a' }
      const b = { id: 2, name: 'b' }
      const c = { id: 3, name: 'c' }
      const d = { id: 4, name: 'd' }

      dataBuffer
        .add(a)
        .add(b)
        .add(c)
        .add(d)

      const resultOne = dataBuffer.filter(item => ['b', 'c'].indexOf(item['name']) !== -1)
      const resultTwo = dataBuffer.filter(item => ['a', 'd'].indexOf(item['name']) !== -1)
      const resultThree = dataBuffer.filter(item => ['a', 'd'].indexOf(item['name']) !== -1)

      expect(resultOne).toEqual([b, c])
      expect(resultTwo).toEqual([a, d])
      expect(resultThree).toEqual([a, d])
      expect(resultTwo === resultThree).toBe(false)
    })
  })

  describe('.maps()', function() {
    it('converts buffer.values() to array then apply Array.maps() with callback', function() {
      const dataBuffer = new DataBuffer('id', reader)
      const a = { id: 1, name: 'a' }
      const b = { id: 2, name: 'b' }
      const c = { id: 3, name: 'c' }
      const d = { id: 4, name: 'd' }

      dataBuffer
        .add(a)
        .add(b)
        .add(c)
        .add(d)

      const result = dataBuffer.map(item => item['name'])

      expect(result).toEqual(['a', 'b', 'c', 'd'])
    })
  })

  describe('.reduce()', function() {
    it('converts buffer.values() to array then apply Array.reduce() with callback', function() {
      const dataBuffer = new DataBuffer('id', reader)
      const a = { id: 1, name: 'a' }
      const b = { id: 2, name: 'b' }
      const c = { id: 3, name: 'c' }
      const d = { id: 4, name: 'd' }

      dataBuffer
        .add(a)
        .add(b)
        .add(c)
        .add(d)

      const result = dataBuffer.reduce((memo, item) => {
        memo += item['id']
        return memo
      }, 0)

      expect(result).toEqual(10)
    })
  })

  describe('.keys()', function() {
    it('converts buffer.keys() to array', function() {
      const dataBuffer = new DataBuffer('id', reader)
      const a = { id: 1, name: 'a' }
      const b = { id: 2, name: 'b' }
      const c = { id: 3, name: 'c' }
      const d = { id: 4, name: 'd' }

      dataBuffer
        .add(a)
        .add(b)
        .add(c)
        .add(d)

      const resultOne = dataBuffer.keys()
      const resultTwo = dataBuffer.keys()
      expect(resultOne).toEqual([1, 2, 3, 4])
      expect(resultTwo).toEqual([1, 2, 3, 4])
      expect(resultOne === resultTwo).toBe(false)
    })
  })

  describe('[Symbol.iterator]()', function() {
    it('returns the iterator of buffer.values()', function() {
      const dataBuffer = new DataBuffer('id', reader)
      dataBuffer.add({ id: 1, name: 'a' })
      dataBuffer.add({ id: 2, name: 'b' })
      dataBuffer.add({ id: 3, name: 'c' })
      const result = []
      for (const item of dataBuffer) {
        result.push(item['name'])
      }
      expect(result.join('')).toEqual('abc')
    })
  })

  describe('.getCollector()', function() {
    it('returns an instance of DataCollector with current DataBuffer instance and reader', function() {
      const dataBuffer = new DataBuffer('id', reader)
      const collector = dataBuffer.getCollector()
      expect(collector).toBeInstanceOf(DataCollector)
      expect(collector['dataBuffer'] === dataBuffer).toBe(true)
      expect(collector['reader'] === reader).toBe(true)
    })
  })
})
