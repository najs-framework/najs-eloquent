import 'jest'
import { Eloquent } from '../../lib/model/Eloquent'
import { DummyDriver } from '../../lib/drivers/DummyDriver'
import { EloquentDriverProviderFacade } from '../../lib/facades/global/EloquentDriverProviderFacade'
import { isModel, isCollection } from '../../lib/util/helpers'
import collect from 'collect.js'

EloquentDriverProviderFacade.register(DummyDriver, 'dummy', true)

class User extends Eloquent {
  static className = 'User'
}

describe('isModel()', function() {
  it('determines the value is instanceof Model or not', function() {
    expect(isModel(new User())).toBe(true)
    expect(isModel({})).toBe(false)
  })
})

describe('isCollection()', function() {
  it('determines the value is instanceof Model or not', function() {
    expect(isCollection(collect([]))).toBe(true)
    expect(isCollection([])).toBe(false)
    expect(isCollection(new User())).toBe(false)
    expect(isCollection({})).toBe(false)
  })
})
