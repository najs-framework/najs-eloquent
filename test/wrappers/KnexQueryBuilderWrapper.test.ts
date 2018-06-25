import 'jest'
import * as Sinon from 'sinon'
import { QueryBuilderWrapper } from '../../lib/wrappers/QueryBuilderWrapper'
import { KnexQueryBuilderWrapper } from '../../lib/wrappers/KnexQueryBuilderWrapper'

describe('KnexQueryBuilderWrapper', function() {
  it('extends QueryBuilderWrapper, implements IAutoload with class name "NajsEloquent.Wrapper.KnexQueryBuilderWrapper"', function() {
    const knexQueryBuilderWrapper = new KnexQueryBuilderWrapper('test', 'test', <any>{})
    expect(knexQueryBuilderWrapper).toBeInstanceOf(QueryBuilderWrapper)
    expect(knexQueryBuilderWrapper.getClassName()).toEqual('NajsEloquent.Wrapper.KnexQueryBuilderWrapper')
  })

  describe('.native()', function() {
    it('calls this.queryBuilder.native() and returns itself', function() {
      const queryBuilder = {
        native() {
          return 'anything'
        }
      }
      const nativeSpy = Sinon.spy(queryBuilder, 'native')
      const knexQueryBuilderWrapper = new KnexQueryBuilderWrapper('test', 'test', <any>queryBuilder)
      const handler = function() {}

      expect(knexQueryBuilderWrapper.native(<any>handler) === knexQueryBuilderWrapper).toBe(true)
      expect(nativeSpy.calledWith(handler)).toBe(true)
    })
  })
})
