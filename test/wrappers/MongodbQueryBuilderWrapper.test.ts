import 'jest'
import * as Sinon from 'sinon'
import { QueryBuilderWrapper } from '../../lib/wrappers/QueryBuilderWrapper'
import { MongodbQueryBuilderWrapper } from '../../lib/wrappers/MongodbQueryBuilderWrapper'

describe('MongodbQueryBuilderWrapper', function() {
  it('extends QueryBuilderWrapper, implements IAutoload with class name "NajsEloquent.Wrapper.MongodbQueryBuilderWrapper"', function() {
    const mongodbQueryBuilderWrapper = new MongodbQueryBuilderWrapper('test', 'test', <any>{})
    expect(mongodbQueryBuilderWrapper).toBeInstanceOf(QueryBuilderWrapper)
    expect(mongodbQueryBuilderWrapper.getClassName()).toEqual('NajsEloquent.Wrapper.MongodbQueryBuilderWrapper')
  })

  describe('.native()', function() {
    it('calls this.queryBuilder.native() and returns the result', function() {
      const queryBuilder = {
        native() {
          return 'anything'
        }
      }
      const nativeSpy = Sinon.spy(queryBuilder, 'native')
      const mongodbQueryBuilderWrapper = new MongodbQueryBuilderWrapper('test', 'test', <any>queryBuilder)
      const handler = function() {}

      expect(mongodbQueryBuilderWrapper.native(<any>handler)).toEqual('anything')
      expect(nativeSpy.calledWith(handler)).toBe(true)
    })
  })
})
