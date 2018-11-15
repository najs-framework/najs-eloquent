import 'jest'
import { make } from 'najs-binding'
import { RecordConditionMatcherFactory } from '../../lib/drivers/RecordConditionMatcherFactory'
import { RecordConditionMatcher } from '../../lib/drivers/RecordConditionMatcher'

describe('RecordConditionMatcherFactory', function() {
  it('implements Autoload with singleton under name "NajsEloquent.Driver.Memory.RecordConditionMatcherFactory"', function() {
    const factory = make<RecordConditionMatcherFactory>(RecordConditionMatcherFactory)
    expect(factory.getClassName()).toEqual('NajsEloquent.Driver.Memory.RecordConditionMatcherFactory')
    const anotherInstance = make<RecordConditionMatcherFactory>(RecordConditionMatcherFactory)
    expect(anotherInstance === factory).toBe(true)
  })

  describe('.make()', function() {
    it('simply returns an instance of RecordConditionMatcher', function() {
      const factory = make<RecordConditionMatcherFactory>(RecordConditionMatcherFactory)
      expect(factory.make({ bool: 'and', field: 'test', operator: '=', value: 'any' })).toBeInstanceOf(
        RecordConditionMatcher
      )
    })
  })

  describe('.transform()', function() {
    it('does nothing, returns the matcher', function() {
      const factory = make<RecordConditionMatcherFactory>(RecordConditionMatcherFactory)
      const data: any = {}
      expect(factory.transform(data) === data).toBe(true)
    })
  })
})
