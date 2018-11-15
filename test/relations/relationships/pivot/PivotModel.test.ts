import 'jest'
import * as Sinon from 'sinon'
import * as NajsBinding from 'najs-binding'
import { Model } from '../../../../lib/model/Model'
import { PivotModel } from '../../../../lib/relations/relationships/pivot/PivotModel'
import { DriverProviderFacade } from '../../../../lib/facades/global/DriverProviderFacade'
import { MemoryDriver } from '../../../../lib/drivers/memory/MemoryDriver'
import { ClassRegistry } from 'najs-binding'

DriverProviderFacade.register(MemoryDriver, 'memory', true)

describe('PivotModel', function() {
  describe('static .createPivotClass()', function() {
    it('creates an ModelClass which is extends from PivotModel', function() {
      const registerSpy = Sinon.spy(NajsBinding, 'register')

      const classDefinition = PivotModel.createPivotClass('test', { name: 'test', foreignKeys: ['a', 'b'] })
      expect(typeof classDefinition).toBe('function')
      const instance: PivotModel = Reflect.construct(classDefinition, [])
      expect(instance).toBeInstanceOf(classDefinition)
      expect(instance).toBeInstanceOf(PivotModel)
      expect(instance).toBeInstanceOf(Model)
      expect(
        instance
          .getDriver()
          .getSettingFeature()
          .getSettingProperty(instance, 'options', {})
      ).toEqual({
        name: 'test',
        foreignKeys: ['a', 'b']
      })

      expect(ClassRegistry.has('NajsEloquent.Pivot.test')).toBe(true)
      expect(ClassRegistry.findOrFail('NajsEloquent.Pivot.test').instanceConstructor === classDefinition).toBe(true)
      expect(registerSpy.calledWith(classDefinition, 'NajsEloquent.Pivot.test')).toBe(true)
      registerSpy.restore()
    })

    it('never recreates if the class already created', function() {
      const registerSpy = Sinon.spy(NajsBinding, 'register')
      const classDefinition = PivotModel.createPivotClass('test', { name: 'test', foreignKeys: ['a', 'b'] })

      expect(typeof classDefinition).toBe('function')
      expect(registerSpy.called).toBe(false)
      registerSpy.restore()
    })

    it('can create with custom className', function() {
      const registerSpy = Sinon.spy(NajsBinding, 'register')
      const classDefinition = PivotModel.createPivotClass(
        'test',
        { name: 'test', foreignKeys: ['a', 'b'] },
        'CustomClassName'
      )

      expect(typeof classDefinition).toBe('function')
      expect(registerSpy.calledWith(classDefinition, 'CustomClassName')).toBe(true)
      registerSpy.restore()
    })
  })

  // this should be at the end of this test suite
  it('extends Model', function() {
    const pivot = new PivotModel()
    expect(pivot).toBeInstanceOf(Model)
  })
})
