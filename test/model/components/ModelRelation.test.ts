import 'jest'
import { ClassSetting } from '../../../lib/util/ClassSetting'
import { Eloquent } from '../../../lib/model/Eloquent'
import { ModelRelation } from '../../../lib/model/components/ModelRelation'
import { DummyDriver } from '../../../lib/drivers/DummyDriver'
import { EloquentDriverProvider } from '../../../lib/facades/global/EloquentDriverProviderFacade'
import { RelationFactory } from '../../../lib/relations/RelationFactory'
import { register } from 'najs-binding'

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

    class Test extends Eloquent {
      static className: string = 'Test'
    }
    register(Test)

    describe('.load()', function() {
      it('does nothing for now', function() {
        const user = new User()
        user.load()
      })
    })

    describe('.getRelationByName()', function() {
      it('throws an Error if there is no "relationsMap" variable', function() {
        try {
          const user = new User()
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

          get postRelation() {
            return this.defineRelationProperty('post').hasOne(Test)
          }
        }
        const model = new ModelA()
        expect(model.getRelationByName('post').getAttachedPropertyName()).toEqual('post')
      })

      it('returns result of function if mapping relationsMap has type "function"', function() {
        class ModelA extends Eloquent {
          static className: string = 'ModelA'

          getUserRelation() {
            return this.defineRelationProperty('post').hasOne('Test')
          }
        }
        const model = new ModelA()
        expect(model.getRelationByName('post').getAttachedPropertyName()).toEqual('post')
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

      it('always returns a RelationFactory instance which cached in "relations"', function() {
        const user = new User()
        const relationFactory = user.defineRelationProperty('test')
        expect(relationFactory).toBeInstanceOf(RelationFactory)
        expect(user['relations']['test'].factory === relationFactory).toBe(true)
        expect(user.defineRelationProperty('test') === relationFactory).toBe(true)
        expect(user.defineRelationProperty('other') === relationFactory).toBe(false)
      })

      it('calls define_relation_property_if_needed() and define the give property in model', function() {
        class HasOneUser extends Eloquent {
          static className = 'HasOneUser'
          getUserRelation() {
            return this.defineRelationProperty('user').hasOne('User')
          }
        }
        const model = new HasOneUser()
        expect(Object.getOwnPropertyDescriptor(HasOneUser.prototype, 'user')).not.toBeUndefined()
        expect(model['user']).toBeUndefined()
      })

      it('define_relation_property_if_needed() throws error if it is not define in right way', function() {
        class HasOneUserError extends Eloquent {
          static className = 'HasOneUserError'
          getUserRelation() {
            return this.defineRelationProperty('user')
          }
        }
        const model = new HasOneUserError()
        try {
          expect(model['user']).toBeUndefined()
        } catch (error) {
          expect(error.message).toEqual('Relation "user" is not defined in model "HasOneUserError".')
          return
        }
        expect('should not reach this line').toEqual('hm')
      })
    })

    describe('findRelationsForModel()', function() {
      it('looks all relationsMap definition in Model and create an "relationsMap" object in prototype', function() {
        class A extends Eloquent {
          static className: string = 'A'

          getBabyRelation() {
            return this.defineRelationProperty('baby').hasOne('Test')
          }
        }

        const instance = new A()
        expect(instance['relationsMap']).toEqual({
          baby: { mapTo: 'getBabyRelation', type: 'function' }
        })
        expect(A.prototype['relationsMap'] === instance['relationsMap']).toBe(true)
      })

      it('also works with relation defined in getter', function() {
        class B extends Eloquent {
          static className: string = 'B'

          get babyRelation() {
            return this.defineRelationProperty('baby').hasOne('Test')
          }
        }

        const instance = new B()

        expect(instance['relationsMap']).toEqual({
          baby: { mapTo: 'babyRelation', type: 'getter' }
        })
        expect(B.prototype['relationsMap'] === instance['relationsMap']).toBe(true)
      })

      it('skip if the model has no relation definition', function() {
        class C extends Eloquent {
          static className: string = 'C'

          getBaby() {
            return 'invalid'
          }
        }

        const instance = new C()

        expect(instance['relationsMap']).toEqual({})
        expect(C.prototype['relationsMap'] === instance['relationsMap']).toBe(true)
      })

      it('handles any error could happen when try to read defined relations', function() {
        class D extends Eloquent {
          static className: string = 'D'

          getSomething() {
            throw Error()
          }
        }

        const instance = new D()

        expect(instance['relationsMap']).toEqual({})
        expect(D.prototype['relationsMap'] === instance['relationsMap']).toBe(true)
      })

      it('also works with inheritance relations', function() {
        class E extends Eloquent {
          static className: string = 'E'

          get babyRelation() {
            return this.defineRelationProperty('baby').hasOne('Test')
          }
        }
        class F extends E {
          static className: string = 'F'

          getCindyRelation() {
            return this.defineRelationProperty('cindy').hasOne('Test')
          }
        }

        const instance = new F()

        expect(instance['relationsMap']).toEqual({
          baby: { mapTo: 'babyRelation', type: 'getter' },
          cindy: { mapTo: 'getCindyRelation', type: 'function' }
        })
        expect(F.prototype['relationsMap'] === instance['relationsMap']).toBe(true)
      })
    })
  })
})
