import 'jest'
import '../../../lib/factory/FactoryManager'
import * as NajsBinding from 'najs-binding'
import * as Sinon from 'sinon'
import { NajsEloquent } from '../../../lib/constants'
import { FactoryFacade, factory } from '../../../lib/facades/global/FactoryFacade'
import { FactoryBuilder } from '../../../lib/factory/FactoryBuilder'

describe('FactoryFacade', function() {
  it('calls make() to create new instance of FactoryManager as a facade root', function() {
    const makeSpy = Sinon.spy(NajsBinding, 'make')
    FactoryFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(NajsEloquent.Factory.FactoryManager)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })

  describe('factory()', function() {
    it('is a shortcut to create a FactoryBuilder', function() {
      const result = factory('Test')
      expect(result).toBeInstanceOf(FactoryBuilder)
      expect(result['className']).toEqual('Test')
      expect(result['name']).toEqual('default')
    })

    it('can create FacadeBuilder with className and name', function() {
      const result = factory('Test', 'name')
      expect(result).toBeInstanceOf(FactoryBuilder)
      expect(result['className']).toEqual('Test')
      expect(result['name']).toEqual('name')
    })

    it('can create FacadeBuilder with className and amount', function() {
      const result = factory('Test', 10)
      expect(result).toBeInstanceOf(FactoryBuilder)
      expect(result['className']).toEqual('Test')
      expect(result['name']).toEqual('default')
      expect(result['amount']).toEqual(10)
    })

    it('can create FacadeBuilder with className, name and amount', function() {
      const result = factory('Test', 'name', 10)
      expect(result).toBeInstanceOf(FactoryBuilder)
      expect(result['className']).toEqual('Test')
      expect(result['name']).toEqual('name')
      expect(result['amount']).toEqual(10)
    })

    it('always call .times() even the amount is less than 1 or 0', function() {
      const a = factory('Test', 'name', 0)
      expect(a).toBeInstanceOf(FactoryBuilder)
      expect(a['className']).toEqual('Test')
      expect(a['name']).toEqual('name')
      expect(a['amount']).toEqual(0)

      const b = factory('Test', 'name', -1)
      expect(b).toBeInstanceOf(FactoryBuilder)
      expect(b['className']).toEqual('Test')
      expect(b['name']).toEqual('name')
      expect(b['amount']).toEqual(-1)
    })
  })
})
