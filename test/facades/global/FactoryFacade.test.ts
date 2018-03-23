import 'jest'
import '../../../lib/factory/FactoryManager'
import * as NajsBinding from 'najs-binding'
import * as Sinon from 'sinon'
import { NajsEloquentClass } from '../../../lib/constants'
import { FactoryFacade } from '../../../lib/facades/global/FactoryFacade'

describe('FactoryFacade', function() {
  it('calls make() to create new instance of FactoryManager as a facade root', function() {
    const makeSpy = Sinon.spy(NajsBinding, 'make')
    FactoryFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(NajsEloquentClass.FactoryManager)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
