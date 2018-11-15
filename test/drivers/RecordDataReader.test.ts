import 'jest'
import * as Sinon from 'sinon'
import { Record } from '../../lib/drivers/Record'
import { RecordDataReader } from '../../lib/drivers/RecordDataReader'
import * as Helpers from '../../lib/util/helpers'

describe('RecordDataReader', function() {
  describe('.getAttribute()', function() {
    it('calls and returns data.getAttribute()', function() {
      const record = new Record()

      const stub = Sinon.stub(record, 'getAttribute')
      stub.returns('anything')
      expect(RecordDataReader.getAttribute(record, 'a')).toEqual('anything')
      expect(stub.calledWith('a')).toBe(true)
    })
  })

  describe('.pick()', function() {
    it('creates new Record instance with the Lodash.pick() data', function() {
      const record = new Record({ id: 1, first_name: 'a', last_name: 'x', age: 30 })
      const result = RecordDataReader.pick(record, ['first_name', 'last_name'])
      expect(result === record).toBe(false)
      expect(result.toObject()).toEqual({ first_name: 'a', last_name: 'x' })
    })
  })

  describe('.toComparable()', function() {
    it('returns value if the given value is not ObjectID', function() {
      expect(RecordDataReader.toComparable('test') === 'test').toBe(true)

      const obj = {}
      expect(RecordDataReader.toComparable(obj) === obj).toBe(true)
    })

    it('returns value.toHexString() if the given value is ObjectID, determine function is Helper.isObjectId()', function() {
      const stub = Sinon.stub(Helpers, 'isObjectId')
      stub.returns(true)

      const obj = {
        toHexString() {
          return 'hex'
        }
      }
      expect(RecordDataReader.toComparable(obj) === obj).toBe(false)
      expect(RecordDataReader.toComparable(obj)).toEqual('hex')
      stub.restore()
    })
  })
})
