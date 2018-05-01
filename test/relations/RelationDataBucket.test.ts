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
})
