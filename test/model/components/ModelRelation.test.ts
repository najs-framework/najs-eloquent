import 'jest'
// import * as Sinon from 'sinon'
import { ClassSetting } from '../../../lib/util/ClassSetting'
import { Eloquent } from '../../../lib/model/Eloquent'
import { ModelRelation, findRelationsForModel } from '../../../lib/model/components/ModelRelation'
import { DummyDriver } from '../../../lib/drivers/DummyDriver'
import { EloquentDriverProvider } from '../../../lib/facades/global/EloquentDriverProviderFacade'

EloquentDriverProvider.register(DummyDriver, 'dummy', true)

describe('ModelRelation', function() {
  describe('Unit', function() {
    describe('.getClassName()', function() {
      it('implements Najs.Contracts.Autoload and returns "NajsEloquent.Model.Component.ModelRelation" as class name', function() {
        const relation = new ModelRelation()
        expect(relation.getClassName()).toEqual('NajsEloquent.Model.Component.ModelRelation')
      })
    })

    describe('.extend()', function() {
      it('extends the given prototype with 3 functions', function() {
        const functions = {
          load: 'load',
          getRelationByName: 'getRelationByName',
          defineRelationProperty: 'defineRelationProperty'
        }
        const prototype = {}
        const relation = new ModelRelation()
        relation.extend(prototype, [], <any>{})
        for (const name in functions) {
          expect(typeof prototype[name] === 'function').toBe(true)
          expect(prototype[name] === ModelRelation[functions[name]]).toBe(true)
        }
      })
    })
  })

  describe('Integration', function() {
    class User extends Eloquent {
      static className: string = 'User'
    }

    describe('.load()', function() {
      it('does nothing for now', function() {
        const user = new User()
        user.load()
      })
    })

    describe('.getRelationByName()', function() {
      it('throws an Error if there is no "relations" variable', function() {
        try {
          const user = new User()
          user.getRelationByName('post')
        } catch (error) {
          expect(error.message).toEqual('Relation "post" is not found in model "User".')
          return
        }
        expect('Should not reach this line').toEqual('Hmm')
      })

      it('throws an Error if there is no relation configuration in this."relations"', function() {
        try {
          const user = new User()
          user['relations'] = {}
          user.getRelationByName('post')
        } catch (error) {
          expect(error.message).toEqual('Relation "post" is not found in model "User".')
          return
        }
        expect('Should not reach this line').toEqual('Hmm')
      })

      it('returns the property if mapping relations has type "getter"', function() {
        class ModelA extends Eloquent {
          static className: string = 'ModelA'

          get userRelation() {
            return 'user-relation'
          }
        }
        const model = new ModelA()
        model['relations'] = {
          user: { mapTo: 'userRelation', type: 'getter' }
        }

        expect(model.getRelationByName('user')).toEqual('user-relation')
      })

      it('returns result of function if mapping relations has type "function"', function() {
        class ModelA extends Eloquent {
          static className: string = 'ModelA'

          getUserRelation() {
            return 'user-relation'
          }
        }
        const model = new ModelA()
        model['relations'] = {
          user: { mapTo: 'getUserRelation', type: 'function' }
        }

        expect(model.getRelationByName('user')).toEqual('user-relation')
      })
    })

    describe('.defineRelationProperty()', function() {
      it('set name to this.relationName if the instance is sample instance', function() {
        const user = new User()

        user.defineRelationProperty('test')
        expect(user['relationName']).toBeUndefined()

        const sample = ClassSetting.get(user).getSample<User>()
        sample.defineRelationProperty('test')
        expect(sample['relationName']).toEqual('test')
      })

      it('always return a RelationFactory instance', function() {
        // TODO: here
      })
    })

    describe('findRelationsForModel()', function() {
      it('looks all relations definition in Model and create an "relations" object in prototype', function() {
        class A extends Eloquent {
          static className: string = 'A'

          getBabyRelation() {
            return this.defineRelationProperty('baby').hasOne('test')
          }
        }

        const instance = new A()
        findRelationsForModel(instance)
        expect(instance['relations']).toEqual({
          baby: { mappedTo: 'getBabyRelation', type: 'function' }
        })
        expect(A.prototype['relations'] === instance['relations']).toBe(true)
      })

      it('also works with relation defined in getter', function() {
        class B extends Eloquent {
          static className: string = 'B'

          get babyRelation() {
            return this.defineRelationProperty('baby').hasOne('test')
          }
        }

        const instance = new B()
        findRelationsForModel(instance)

        expect(instance['relations']).toEqual({
          baby: { mappedTo: 'babyRelation', type: 'getter' }
        })
        expect(B.prototype['relations'] === instance['relations']).toBe(true)
      })

      it('skip if the model has no relation definition', function() {
        class C extends Eloquent {
          static className: string = 'C'

          getBaby() {
            return 'invalid'
          }
        }

        const instance = new C()
        findRelationsForModel(instance)

        expect(instance['relations']).toEqual({})
        expect(C.prototype['relations'] === instance['relations']).toBe(true)
      })

      it('handles any error could happen when try to read defined relations', function() {
        class D extends Eloquent {
          static className: string = 'D'

          getSomething() {
            throw Error()
          }
        }

        const instance = new D()
        findRelationsForModel(instance)

        expect(instance['relations']).toEqual({})
        expect(D.prototype['relations'] === instance['relations']).toBe(true)
      })

      it('also works with inheritance relations', function() {
        class E extends Eloquent {
          static className: string = 'E'

          get babyRelation() {
            return this.defineRelationProperty('baby').hasOne('test')
          }
        }
        class F extends E {
          static className: string = 'F'

          getCindyRelation() {
            return this.defineRelationProperty('cindy').hasOne('test')
          }
        }

        const instance = new F()
        findRelationsForModel(instance)

        expect(instance['relations']).toEqual({
          baby: { mappedTo: 'babyRelation', type: 'getter' },
          cindy: { mappedTo: 'getCindyRelation', type: 'function' }
        })
        expect(F.prototype['relations'] === instance['relations']).toBe(true)
      })
    })
  })
})
