import 'jest'
import * as Sinon from 'sinon'
import { Eloquent } from '../../../lib/model/Eloquent'
import { ModelTimestamps } from '../../../lib/model/components/ModelTimestamps'
import { DummyDriver } from '../../../lib/drivers/DummyDriver'
import { EloquentDriverProvider } from '../../../lib/facades/global/EloquentDriverProviderFacade'

EloquentDriverProvider.register(DummyDriver, 'dummy', true)

describe('Model/Fillable', function() {
  describe('Unit', function() {
    describe('.getClassName()', function() {
      it('implements Najs.Contracts.Autoload and returns "NajsEloquent.Model.Component.ModelTimestamps" as class name', function() {
        const timestamps = new ModelTimestamps()
        expect(timestamps.getClassName()).toEqual('NajsEloquent.Model.Component.ModelTimestamps')
      })
    })

    describe('.extend()', function() {
      it('extends the given prototype with 8 functions', function() {
        const functions = ['touch', 'hasTimestamps', 'getTimestampsSetting']
        const prototype = {}
        const timestamps = new ModelTimestamps()
        timestamps.extend(prototype, [], <any>{})
        for (const name of functions) {
          expect(typeof prototype[name] === 'function').toBe(true)
          expect(prototype[name] === ModelTimestamps[name]).toBe(true)
        }
      })
    })
  })

  describe('Integration', function() {
    class NotUse extends Eloquent {
      static className = 'NotUse'
    }

    class StaticTrue extends Eloquent {
      static className = 'StaticTrue'
      static timestamps = true
    }

    class MemberTrue extends Eloquent {
      static className = 'MemberTrue'
      protected timestamps = true
    }

    class StaticFalse extends Eloquent {
      static className = 'StaticFalse'
      static timestamps = false
    }

    class MemberFalse extends Eloquent {
      static className = 'MemberFalse'
      timestamps = false
    }

    class StaticCustom extends Eloquent {
      static className = 'StaticCustom'
      static timestamps = { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }

    class MemberCustom extends Eloquent {
      static className = 'MemberCustom'
      static timestamps = { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }

    class Both extends Eloquent {
      static className = 'Both'
      static timestamps = true
      timestamps = { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }

    describe('.hasTimestamps()', function() {
      it('determines timestamps settings is exist or not', function() {
        expect(new NotUse().hasTimestamps()).toEqual(false)
        expect(new StaticTrue().hasTimestamps()).toEqual(true)
        expect(new MemberTrue().hasTimestamps()).toEqual(true)
        expect(new StaticFalse().hasTimestamps()).toEqual(false)
        expect(new MemberFalse().hasTimestamps()).toEqual(false)
        expect(new StaticCustom().hasTimestamps()).toEqual(true)
        expect(new MemberCustom().hasTimestamps()).toEqual(true)
        expect(new Both().hasTimestamps()).toEqual(true)
      })
    })

    describe('.getTimestampsSetting()', function() {
      it('always returns DEFAULT_TIMESTAMPS despite the .hasTimestamps() returns false', function() {
        expect(new NotUse().getTimestampsSetting()).toEqual(ModelTimestamps.DefaultSetting)
        expect(new StaticTrue().getTimestampsSetting()).toEqual(ModelTimestamps.DefaultSetting)
        expect(new MemberTrue().getTimestampsSetting()).toEqual(ModelTimestamps.DefaultSetting)
        expect(new StaticFalse().getTimestampsSetting()).toEqual(ModelTimestamps.DefaultSetting)
        expect(new MemberFalse().getTimestampsSetting()).toEqual(ModelTimestamps.DefaultSetting)
        expect(new Both().getTimestampsSetting()).toEqual(ModelTimestamps.DefaultSetting)
      })

      it('returns custom settings instead of default if defined', function() {
        expect(new StaticCustom().getTimestampsSetting()).toEqual({ createdAt: 'createdAt', updatedAt: 'updatedAt' })
        expect(new MemberCustom().getTimestampsSetting()).toEqual({ createdAt: 'createdAt', updatedAt: 'updatedAt' })
      })
    })

    describe('.touch()', function() {
      it('is chainable', function() {
        const enabled = new StaticTrue()
        expect(enabled.touch() === enabled).toBe(true)

        const disabled = new NotUse()
        expect(disabled.touch() === disabled).toBe(true)
      })

      it('calls .driver.markModified() if there .hasTimestamps() returns true', function() {
        const driver = {
          markModified() {}
        }
        const markModifiedSpy = Sinon.spy(driver, 'markModified')

        const staticTrue = new StaticTrue()
        staticTrue['driver'] = <any>driver
        staticTrue.touch()
        expect(markModifiedSpy.calledWith('updated_at')).toBe(true)
        markModifiedSpy.resetHistory()

        const staticFalse = new StaticFalse()
        staticFalse['driver'] = <any>driver
        staticFalse.touch()
        expect(markModifiedSpy.calledWith('updated_at')).toBe(false)
        markModifiedSpy.resetHistory()

        const staticCustom = new StaticCustom()
        staticCustom['driver'] = <any>driver
        staticCustom.touch()
        expect(markModifiedSpy.calledWith('updatedAt')).toBe(true)
      })
    })
  })
})
