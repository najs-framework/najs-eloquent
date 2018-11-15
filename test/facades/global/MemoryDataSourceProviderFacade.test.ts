import 'jest'
import '../../../lib/drivers/memory/MemoryDataSource'
import * as NajsBinding from 'najs-binding'
import * as Sinon from 'sinon'
import { NajsEloquent } from '../../../lib/constants'
import { MemoryDataSourceProviderFacade } from '../../../lib/facades/global/MemoryDataSourceProviderFacade'

describe('MemoryDataSourceProviderFacade', function() {
  it('calls make() to create new instance of MemoryDataSourceFacade as a facade root', function() {
    const makeSpy = Sinon.spy(NajsBinding, 'make')
    MemoryDataSourceProviderFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(NajsEloquent.Provider.MemoryDataSourceProvider)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
