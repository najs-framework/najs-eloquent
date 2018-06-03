import 'jest'
import * as Sinon from 'sinon'
import { ModelEvent } from '../../../lib/model/components/ModelEvent'
import { Eloquent } from '../../../lib/model/Eloquent'
import { DummyDriver } from '../../../lib/drivers/DummyDriver'
import { EloquentDriverProvider } from '../../../lib/facades/global/EloquentDriverProviderFacade'

EloquentDriverProvider.register(DummyDriver, 'dummy', true)

const EVENT_EMITTER_FUNCTIONS = {
  addListener: true,
  on: true,
  once: true,
  prependListener: true,
  prependOnceListener: true,
  removeListener: true,
  removeAllListeners: true,
  setMaxListeners: true,
  getMaxListeners: false,
  listeners: false,
  emit: false,
  eventNames: false,
  listenerCount: false
}

describe('ModelEvent', function() {
  it('implements Autoload with class name "NajsEloquent.Model.Component.ModelEvent"', function() {
    const modelEvent = new ModelEvent()
    expect(modelEvent.getClassName()).toEqual('NajsEloquent.Model.Component.ModelEvent')
  })

  for (const name in EVENT_EMITTER_FUNCTIONS) {
    class Test extends Eloquent {
      static className = 'Test'
    }

    describe(`.${name}()`, function() {
      it(`passes all argument to this.eventEmitter.${name}()`, function() {
        const instance = new Test()
        // eventEmitter is initialize dynamically
        instance.getMaxListeners()

        const stub = Sinon.stub(instance['eventEmitter']!, <any>name)
        stub.returns('anything')

        if (EVENT_EMITTER_FUNCTIONS[name]) {
          expect(instance[name]('a', 'b', 'c') === instance).toBe(true)
        } else {
          expect(instance[name]('a', 'b', 'c')).toEqual('anything')
        }
        expect(stub.calledWith('a', 'b', 'c')).toBe(true)
      })
    })
  }
})
