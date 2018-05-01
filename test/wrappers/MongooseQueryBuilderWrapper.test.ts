import 'jest'
import * as Sinon from 'sinon'
import { QueryBuilderWrapper } from '../../lib/wrappers/QueryBuilderWrapper'
import { MongooseQueryBuilderWrapper } from '../../lib/wrappers/MongooseQueryBuilderWrapper'

describe('MongooseQueryBuilderWrapper', function() {
  it('extends QueryBuilderWrapper, implements IAutoload with class name "NajsEloquent.Wrapper.MongooseQueryBuilderWrapper"', function() {
    const mongooseQueryBuilderWrapper = new MongooseQueryBuilderWrapper('test', 'test', <any>{})
    expect(mongooseQueryBuilderWrapper).toBeInstanceOf(QueryBuilderWrapper)
    expect(mongooseQueryBuilderWrapper.getClassName()).toEqual('NajsEloquent.Wrapper.MongooseQueryBuilderWrapper')
  })

  describe('.native()', function() {
    it('calls this.queryBuilder.native() and returns the result', function() {
      const queryBuilder = {
        native() {
          return 'anything'
        }
      }
      const nativeSpy = Sinon.spy(queryBuilder, 'native')
      const mongooseQueryBuilderWrapper = new MongooseQueryBuilderWrapper('test', 'test', <any>queryBuilder)
      const handler = function() {}

      expect(mongooseQueryBuilderWrapper.native(<any>handler)).toEqual('anything')
      expect(nativeSpy.calledWith(handler)).toBe(true)
    })
  })
})
