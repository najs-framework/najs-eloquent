import 'jest'
import { RelationDataBucket } from '../../lib/relations/RelationDataBucket'

describe('RelationDataBucket', function() {
  it('implements IAutoload and returns class name "NajsEloquent.Relation.RelationDataBucket"', function() {
    const relationDataBucket = new RelationDataBucket()
    expect(relationDataBucket.getClassName()).toEqual('NajsEloquent.Relation.RelationDataBucket')
  })

  describe('.newInstance()', function() {
    it('throws a ReferenceError if the name is not mapped to any model', function() {
      const relationDataBucket = new RelationDataBucket()
      try {
        relationDataBucket.newInstance('test', {})
      } catch (error) {
        expect(error).toBeInstanceOf(ReferenceError)
        expect(error.message).toEqual('"test" is not found or not registered yet.')
        return
      }
      expect('should not reach this line').toEqual('hm')
    })
  })

  describe('.getAttributes()', function() {
    it('returns an empty array if there is no name in bucket', function() {
      const relationDataBucket = new RelationDataBucket()
      expect(relationDataBucket.getAttributes('test', 'attribute')).toEqual([])
    })

    it('loops all this.bucket[name] and get the attribute then push them to the list', function() {
      const relationDataBucket = new RelationDataBucket()
      relationDataBucket['bucket'] = {
        test: {
          1: { a: 'a1', b: 'b1' },
          2: { a: 'a2', b: 'b2' },
          3: { a: 'a3', b: 'b2' }
        }
      }
      expect(relationDataBucket.getAttributes('test', 'a')).toEqual(['a1', 'a2', 'a3'])
    })

    it('loops all this.bucket[name] and skip if the value is undefined or null', function() {
      const relationDataBucket = new RelationDataBucket()
      relationDataBucket['bucket'] = {
        test: {
          1: { a: 'a1', b: 'b1' },
          2: { a: undefined, b: 'b2' },
          // tslint:disable-next-line
          3: { a: null, b: 'b2' },
          4: { a: 'a4', b: 'b2' }
        }
      }
      expect(relationDataBucket.getAttributes('test', 'a')).toEqual(['a1', 'a4'])
    })

    it('remove repetition if the third param is false, otherwise it does not', function() {
      const relationDataBucket = new RelationDataBucket()
      relationDataBucket['bucket'] = {
        test: {
          1: { a: 'a1', b: 'b1' },
          2: { a: 'a2', b: 'b2' },
          3: { a: 'a3', b: 'b2' }
        }
      }
      expect(relationDataBucket.getAttributes('test', 'b')).toEqual(['b1', 'b2'])
      expect(relationDataBucket.getAttributes('test', 'b', true)).toEqual(['b1', 'b2', 'b2'])
    })
  })
})
