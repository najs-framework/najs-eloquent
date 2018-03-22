import 'jest'
import '../../../lib/providers/DriverManager'
import * as NajsBinding from 'najs-binding'
import * as Sinon from 'sinon'
import { NajsEloquentClass } from '../../../lib/constants'
import { EloquentDriverProviderFacade } from '../../../lib/facades/global/EloquentDriverProviderFacade'

describe('EloquentDriverProviderFacade', function() {
  it('calls make() to create new instance of DriverManager as a facade root', function() {
    const makeSpy = Sinon.spy(NajsBinding, 'make')
    EloquentDriverProviderFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(NajsEloquentClass.DriverManager)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
