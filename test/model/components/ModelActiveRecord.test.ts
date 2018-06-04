import 'jest'
import * as Sinon from 'sinon'
import { Eloquent } from '../../../lib/model/Eloquent'
import { ModelActiveRecord } from '../../../lib/model/components/ModelActiveRecord'
import { DummyDriver } from '../../../lib/drivers/DummyDriver'
import { EloquentDriverProvider } from '../../../lib/facades/global/EloquentDriverProviderFacade'
import { EventEmitter } from 'events'
import { Event } from '../../../lib/model/Event'

EloquentDriverProvider.register(DummyDriver, 'dummy', true)

describe('Model/Fillable', function() {
  describe('Unit', function() {
    describe('.getClassName()', function() {
      it('implements Najs.Contracts.Autoload and returns "NajsEloquent.Model.Component.ModelActiveRecord" as class name', function() {
        const activeRecord = new ModelActiveRecord()
        expect(activeRecord.getClassName()).toEqual('NajsEloquent.Model.Component.ModelActiveRecord')
      })
    })

    describe('.extend()', function() {
      it('extends the given prototype with 8 functions', function() {
        const functions = ['isNew', 'isDirty', 'getDirty', 'delete', 'save', 'fresh']
        const prototype = {}
        const activeRecord = new ModelActiveRecord()
        activeRecord.extend(prototype, [], <any>{})
        for (const name of functions) {
          expect(typeof prototype[name] === 'function').toBe(true)
          expect(prototype[name] === ModelActiveRecord[name]).toBe(true)
        }
      })
    })
  })

  describe('Integration', function() {
    class Model extends Eloquent {
      static className = 'Model'
    }

    describe('.isNew()', function() {
      it('simply calls driver.isNew()', function() {
        const driver = {
          isNew() {
            return 'anything'
          }
        }
        const model = new Model()
        model['driver'] = <any>driver
        expect(model.isNew()).toEqual('anything')
      })
    })

    describe('.isDirty()', function() {
      it('flattens arguments, loops and calls driver.isModified() with AND operator', function() {
        const driver = {
          isModified(name: string) {
            if (name === 'false') {
              return false
            }
            return true
          }
        }
        const model = new Model()
        model['driver'] = <any>driver
        expect(model.isDirty('a')).toBe(true)
        expect(model.isDirty('false')).toBe(false)
        expect(model.isDirty('a', 'b', 'c')).toBe(true)
        expect(model.isDirty(['a', 'b'], 'c')).toBe(true)
        expect(model.isDirty(['a', 'b'], 'false')).toBe(false)
        expect(model.isDirty('false', 'a', 'b')).toBe(false)
      })
    })

    describe('.getDirty()', function() {
      it('calls and returns driver.getModified()', function() {
        const driver = {
          getModified(name: string) {
            return 'getModified'
          }
        }
        const model = new Model()
        model['driver'] = <any>driver
        expect(model.getDirty()).toEqual('getModified')
      })
    })

    describe('.delete()', function() {
      it('simply calls driver.delete() with param from this.hasSoftDeletes()', async function() {
        const driver = {
          async delete() {
            return 'anything'
          },
          getEventEmitter() {
            return new EventEmitter()
          }
        }
        const deleteSpy = Sinon.spy(driver, 'delete')

        const model = new Model()
        const hasSoftDeletesStub = Sinon.stub(model, 'hasSoftDeletes')
        hasSoftDeletesStub.returns('value')
        model['driver'] = <any>driver

        expect(await model.delete()).toEqual('anything')
        expect(deleteSpy.calledWith('value')).toBe(true)
      })

      it('fires event Deleting before call delete() and Deleted afterward', async function() {
        const driver = {
          async delete() {
            return 'anything'
          },
          getEventEmitter() {
            return new EventEmitter()
          }
        }

        const model = new Model()
        const fireSpy = Sinon.spy(model, 'fire')
        model['driver'] = <any>driver

        expect(await model.delete()).toEqual('anything')
        expect(fireSpy.callCount).toEqual(2)
        expect(fireSpy.firstCall.calledWith(Event.Deleting)).toBe(true)
        expect(fireSpy.secondCall.calledWith(Event.Deleted)).toBe(true)
      })
    })

    describe('.save()', function() {
      it('simply calls driver.save() and returns a Promise which contains this', async function() {
        const driver = {
          async save() {
            return 'anything'
          },
          isNew() {
            return true
          },
          getEventEmitter() {
            return new EventEmitter()
          }
        }
        const saveSpy = Sinon.spy(driver, 'save')

        const model = new Model()
        model['driver'] = <any>driver

        expect((await model.save()) === model).toBe(true)
        expect(saveSpy.called).toBe(true)
      })

      it('fires event Creating + Saving before call save() and Created + Saved if isNew() return true', async function() {
        const driver = {
          async save() {
            return 'anything'
          },
          isNew() {
            return true
          },
          getEventEmitter() {
            return new EventEmitter()
          }
        }

        const model = new Model()
        const fireSpy = Sinon.spy(model, 'fire')
        model['driver'] = <any>driver

        expect((await model.save()) === model).toBe(true)
        expect(fireSpy.callCount).toEqual(4)
        expect(fireSpy.firstCall.calledWith(Event.Creating)).toBe(true)
        expect(fireSpy.secondCall.calledWith(Event.Saving)).toBe(true)
        expect(fireSpy.thirdCall.calledWith(Event.Created)).toBe(true)
        expect(fireSpy.getCall(3).calledWith(Event.Saved)).toBe(true)
      })

      it('fires event Updating + Saving before call save() and Updated + Saved if isNew() return false', async function() {
        const driver = {
          async save() {
            return 'anything'
          },
          isNew() {
            return false
          },
          getEventEmitter() {
            return new EventEmitter()
          }
        }

        const model = new Model()
        const fireSpy = Sinon.spy(model, 'fire')
        model['driver'] = <any>driver

        expect((await model.save()) === model).toBe(true)
        expect(fireSpy.callCount).toEqual(4)
        expect(fireSpy.firstCall.calledWith(Event.Updating)).toBe(true)
        expect(fireSpy.secondCall.calledWith(Event.Saving)).toBe(true)
        expect(fireSpy.thirdCall.calledWith(Event.Updated)).toBe(true)
        expect(fireSpy.getCall(3).calledWith(Event.Saved)).toBe(true)
      })
    })

    describe('.fresh()', function() {
      it('always returns null if the this.isNew() returns true', async function() {
        const model = new Model()
        const isNew = Sinon.stub(model, 'isNew')
        isNew.returns(true)
        const findByIdStub = Sinon.stub(model, 'findById')
        findByIdStub.callsFake(async function() {
          return 'anything'
        })

        expect(await model.fresh()).toBeNull()
        expect(findByIdStub.called).toBe(false)
      })

      it('returns result of .findById() if the this.isNew() returns false', async function() {
        const model = new Model()
        const isNew = Sinon.stub(model, 'isNew')
        isNew.returns(false)

        const getPrimaryKeyStub = Sinon.stub(model, 'getPrimaryKey')
        getPrimaryKeyStub.returns('primary-key')
        const findByIdStub = Sinon.stub(model, 'findById')
        findByIdStub.callsFake(async function() {
          return 'anything'
        })

        expect(await model.fresh()).toEqual('anything')
        expect(findByIdStub.calledWith('primary-key')).toBe(true)
      })
    })
  })
})
