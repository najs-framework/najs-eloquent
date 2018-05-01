import 'jest'
import * as Sinon from 'sinon'
import * as NajsBinding from 'najs-binding'
import { register, IAutoload } from 'najs-binding'
import { ClassSetting, CREATE_SAMPLE } from '../../lib/util/ClassSetting'

describe('ClassSetting', function() {
  class One implements IAutoload {
    param: any
    constructor(param?: any) {
      this.param = param
    }

    getClassName() {
      return 'One'
    }
  }
  register(One)

  describe('static of()', function() {
    it('creates an sample instance with param "CREATE_SAMPLE" if there is no instance in samples cache', function() {
      expect(ClassSetting['samples']).toEqual({})

      const cloneSpy = Sinon.spy(ClassSetting.prototype, <any>'clone')
      const makeSpy = Sinon.spy(NajsBinding, 'make')

      const instance = new One()

      ClassSetting.of(instance)

      expect(ClassSetting['samples']['One']).toBeInstanceOf(ClassSetting)
      expect(makeSpy.calledWith('One', [CREATE_SAMPLE])).toBe(true)
      expect(ClassSetting['samples']['One'].sample.param).toEqual(CREATE_SAMPLE)
      expect(instance['param']).toBeUndefined()
      expect(cloneSpy.calledWith(instance)).toBe(true)

      makeSpy.restore()
      cloneSpy.restore()
    })

    it('skip creates ClassSetting if there is a samples cache', function() {
      const cloneSpy = Sinon.spy(ClassSetting.prototype, <any>'clone')
      const makeSpy = Sinon.spy(NajsBinding, 'make')
      const instance = new One()
      ClassSetting.of(instance)
      expect(makeSpy.called).toBe(false)
      expect(cloneSpy.calledWith(instance)).toBe(true)

      makeSpy.restore()
      cloneSpy.restore()
    })

    it('always calls .clone() to make a replica with instance value', function() {
      const cloneSpy = Sinon.spy(ClassSetting.prototype, <any>'clone')
      const makeSpy = Sinon.spy(NajsBinding, 'make')

      const instance = new One()
      ClassSetting.of(instance)
      expect(makeSpy.called).toBe(false)
      expect(cloneSpy.calledWith(instance)).toBe(true)

      makeSpy.restore()
      cloneSpy.restore()
    })
  })

  describe('.read()', function() {
    const Reader = {
      read: function(a?: string, b?: string, c?: string) {
        return (a ? a : '') + '-' + (b ? b : '') + '-' + (c ? c : '')
      }
    }

    it('always calls reader which is a 2nd param', function() {
      const mergerSpy = Sinon.spy(Reader, 'read')
      const instance = new One()

      ClassSetting.of(instance).read('test', Reader.read)

      expect(mergerSpy.called).toBe(true)
      mergerSpy.restore()
    })

    it('passes a "static" version to reader at 1st param if it exists', function() {
      class StaticOnly implements IAutoload {
        static test = 'static'
        getClassName() {
          return 'StaticOnly'
        }
      }
      register(StaticOnly)

      const mergerSpy = Sinon.spy(Reader, 'read')

      const result = ClassSetting.of(new StaticOnly()).read('test', Reader.read)

      expect(mergerSpy.calledWith('static', undefined, undefined)).toBe(true)
      expect(result).toEqual('static--')
      mergerSpy.restore()
    })

    it('passes a "sample" version to reader at 2nd param if it exists', function() {
      class SampleOnly implements IAutoload {
        test = 'sample'
        getClassName() {
          return 'SampleOnly'
        }
      }
      register(SampleOnly)

      const mergerSpy = Sinon.spy(Reader, 'read')

      const result = ClassSetting.of(new SampleOnly()).read('test', Reader.read)

      expect(mergerSpy.calledWith(undefined, 'sample', 'sample')).toBe(true)
      expect(result).toEqual('-sample-sample')
      mergerSpy.restore()
    })

    it('passes a "instance" version to reader at 3rd param if it exists', function() {
      class SampleChangeable implements IAutoload {
        static test = 'static'
        test = 'sample'
        getClassName() {
          return 'SampleChangeable'
        }
      }
      register(SampleChangeable)

      const mergerSpy = Sinon.spy(Reader, 'read')
      const instance = new SampleChangeable()

      let result = ClassSetting.of(instance).read('test', Reader.read)
      expect(mergerSpy.calledWith('static', 'sample', 'sample')).toBe(true)
      expect(result).toEqual('static-sample-sample')

      instance.test = 'instance'
      result = ClassSetting.of(instance).read('test', Reader.read)

      expect(mergerSpy.calledWith('static', 'sample', 'instance')).toBe(true)
      expect(result).toEqual('static-sample-instance')
      mergerSpy.restore()
    })
  })

  describe('private .clone()', function() {
    it('creates a replica and assign instance to it', function() {
      const instanceA = new One()
      const instanceB = new One()

      const settingA = ClassSetting.of(instanceA)
      const settingB = settingA['clone'](instanceB)

      expect(settingB !== settingA).toBe(true)
      expect(settingA['instance'] !== settingA).toBe(true)
      expect(settingB['instance'] === instanceB).toBe(true)
      expect(settingA['sample'] === settingB['sample']).toBe(true)
      expect(settingA['definition'] === settingB['definition']).toBe(true)
    })
  })
})
