import 'jest'

import { Eloquent } from '../../lib/model/Eloquent'
import { DummyDriver } from '../../lib/drivers/DummyDriver'
import { EloquentDriverProvider } from '../../lib/facades/global/EloquentDriverProviderFacade'

EloquentDriverProvider.register(DummyDriver, 'dummy', true)

describe('Model Inheritance', function() {
  describe('Override functions', function() {
    class Test extends Eloquent {
      static className: string = 'Test'

      getAttribute(key: string) {
        const value = super.getAttribute(key)
        return this.doSomething(value)
      }

      doSomething(value: string) {
        return value + '-overridden'
      }
    }

    it('could override Eloquent function', function() {
      const test = new Test()
      test.forceFill({ any: 'thing' })
      expect(test.getAttribute('any')).toEqual('thing-overridden')
    })
  })
})
