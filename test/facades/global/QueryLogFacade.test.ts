import 'jest'
import '../../../lib/query-log/FlipFlopQueryLog'
import * as NajsBinding from 'najs-binding'
import * as Sinon from 'sinon'
import { NajsEloquent } from '../../../lib/constants'
import { QueryLogFacade } from '../../../lib/facades/global/QueryLogFacade'

describe('QueryLogFacade', function() {
  it('calls make() to create new instance of FlipFlopQueryLog as a facade root', function() {
    const makeSpy = Sinon.spy(NajsBinding, 'make')
    QueryLogFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(NajsEloquent.QueryLog.FlipFlopQueryLog)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
