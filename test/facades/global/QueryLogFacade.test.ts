import 'jest'
import '../../log/FlipFlopQueryLog.test'
import * as NajsBinding from 'najs-binding'
import * as Sinon from 'sinon'
import { NajsEloquentClass } from '../../../lib/constants'
import { QueryLogFacade } from '../../../lib/facades/global/QueryLogFacade'

describe('QueryLogFacade', function() {
  it('calls make() to create new instance of RedisCache as a facade root', function() {
    const makeSpy = Sinon.spy(NajsBinding, 'make')
    QueryLogFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(NajsEloquentClass.QueryLog)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
