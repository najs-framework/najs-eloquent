import 'jest'
import * as Sinon from 'sinon'
import * as NajsBinding from 'najs-binding'
import { RelationshipFactory } from '../../lib/relations/RelationshipFactory'

describe('RelationshipFactory', function() {
  describe('constructor()', function() {
    it('assigns rootModel & name from params to properties', function() {
      const rootModel: any = {}
      const factory = new RelationshipFactory(rootModel, 'test')
      expect(factory['rootModel'] === rootModel).toBe(true)
      expect(factory['name']).toEqual('test')
    })
  })

  describe('.make()', function() {
    it('creates an relation via make(), then calls modifier if provided', function() {
      const modifierContainer = {
        modifier() {}
      }
      const modifierSpy = Sinon.spy(modifierContainer, 'modifier')
      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.returns('anything')

      const a = {}
      const b = {}
      const rootModel: any = {}
      const factory = new RelationshipFactory(rootModel, 'test')
      factory.make('Test', [a, b], modifierContainer.modifier)

      expect(makeStub.calledWith('Test', [rootModel, 'test', a, b])).toBe(true)
      expect(modifierSpy.calledWith('anything')).toBe(true)
      expect(factory['relationship']).toEqual('anything')
      makeStub.restore()
    })

    it('does not call modifier if not provided', function() {
      const modifierContainer = {
        modifier() {}
      }
      const modifierSpy = Sinon.spy(modifierContainer, 'modifier')
      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.returns('anything')

      const a = {}
      const b = {}
      const rootModel: any = {}
      const factory = new RelationshipFactory(rootModel, 'test')
      factory.make('Test', [a, b])

      expect(makeStub.calledWith('Test', [rootModel, 'test', a, b])).toBe(true)
      expect(modifierSpy.calledWith('anything')).toBe(false)
      expect(factory['relationship']).toEqual('anything')
      makeStub.restore()
    })

    it('just returns the relation if it already exist', function() {
      const modifierContainer = {
        modifier() {}
      }
      const modifierSpy = Sinon.spy(modifierContainer, 'modifier')
      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.returns('anything')

      const a = {}
      const b = {}
      const rootModel: any = {}
      const factory = new RelationshipFactory(rootModel, 'test')
      factory.make('Test', [a, b], modifierContainer.modifier)
      factory.make('Test', [a, b], modifierContainer.modifier)

      expect(makeStub.calledOnce).toBe(true)
      expect(modifierSpy.calledOnce).toBe(true)
      expect(factory['relationship']).toEqual('anything')
      makeStub.restore()
    })
  })

  describe('.findForeignKeyName()', function() {
    it('returns ReferencedModel + "Id" which is formatted by ReferencingModel.formatAttributeName()', function() {
      const referencing: any = {
        formatAttributeName(name: string) {
          return name + '<formatted>'
        }
      }

      const dataset = [
        { name: 'Test', output: 'Test_id<formatted>' },
        { name: 'Namespace.Test', output: 'Test_id<formatted>' },
        { name: 'Long.Namespace.Test', output: 'Test_id<formatted>' }
      ]

      for (const data of dataset) {
        const rootModel: any = {
          getModelName() {
            return data.name
          }
        }
        const factory = new RelationshipFactory(rootModel, 'test')
        const result = factory.findForeignKeyName(referencing, rootModel)
        expect(result).toEqual(data.output)
      }
    })
  })

  describe('.hasOne()', function() {
    it('calls .make() with class "NajsEloquent.Relation.Relationship.HasOne"', function() {
      const rootModel: any = {
        getPrimaryKeyName() {
          return 'id'
        }
      }
      const factory = new RelationshipFactory(rootModel, 'test')

      const makeStub = Sinon.stub(factory, 'make')
      makeStub.returns('anything')

      const findTargetKeyNameStub = Sinon.stub(factory, 'findForeignKeyName')
      findTargetKeyNameStub.returns('test')

      expect(factory.hasOne('Target', 'target_id', 'id')).toEqual('anything')
      expect(findTargetKeyNameStub.called).toBe(false)
      expect(makeStub.calledWith('NajsEloquent.Relation.Relationship.HasOne', ['Target', 'target_id', 'id'])).toBe(true)
    })

    it('calls .findForeignKeyName() to find targetKey if the targetKey is not found', function() {
      const rootModel: any = {
        getPrimaryKeyName() {
          return 'id'
        }
      }
      const targetModel: any = {
        getModelName() {
          return 'Target'
        },
        formatAttributeName(name: string) {
          return 'found_' + name
        }
      }

      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.returns(targetModel)

      const factory = new RelationshipFactory(rootModel, 'test')

      const factoryMakeStub = Sinon.stub(factory, 'make')
      factoryMakeStub.returns('anything')

      const findTargetKeyNameStub = Sinon.stub(factory, 'findForeignKeyName')
      findTargetKeyNameStub.returns('found_target_id')

      expect(factory.hasOne('Target', undefined, 'id')).toEqual('anything')
      expect(findTargetKeyNameStub.calledWith(targetModel, rootModel)).toBe(true)
      expect(
        factoryMakeStub.calledWith('NajsEloquent.Relation.Relationship.HasOne', ['Target', 'found_target_id', 'id'])
      ).toBe(true)

      makeStub.restore()
    })

    it('calls .getPrimaryKeyName() to find rootKeyName if the localKey is not found', function() {
      const rootModel: any = {
        getPrimaryKeyName() {
          return 'found_id'
        }
      }
      const factory = new RelationshipFactory(rootModel, 'test')

      const makeStub = Sinon.stub(factory, 'make')
      makeStub.returns('anything')

      expect(factory.hasOne('Target', 'target_id')).toEqual('anything')
      expect(
        makeStub.calledWith('NajsEloquent.Relation.Relationship.HasOne', ['Target', 'target_id', 'found_id'])
      ).toBe(true)
    })
  })

  describe('.hasMany()', function() {
    it('calls .make() with class "NajsEloquent.Relation.HasManyRelation"', function() {
      const rootModel: any = {
        getPrimaryKeyName() {
          return 'id'
        }
      }
      const factory = new RelationshipFactory(rootModel, 'test')

      const makeStub = Sinon.stub(factory, 'make')
      makeStub.returns('anything')

      const findTargetKeyNameStub = Sinon.stub(factory, 'findForeignKeyName')
      findTargetKeyNameStub.returns('test')

      expect(factory.hasMany('Target', 'target_id', 'id')).toEqual('anything')
      expect(findTargetKeyNameStub.called).toBe(false)
      expect(makeStub.calledWith('NajsEloquent.Relation.Relationship.HasMany', ['Target', 'target_id', 'id'])).toBe(
        true
      )
    })

    it('calls .findForeignKeyName() to find targetKey if the targetKey is not found', function() {
      const rootModel: any = {
        getPrimaryKeyName() {
          return 'id'
        }
      }
      const targetModel: any = {
        getModelName() {
          return 'Target'
        },
        formatAttributeName(name: string) {
          return 'found_' + name
        }
      }

      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.returns(targetModel)

      const factory = new RelationshipFactory(rootModel, 'test')

      const factoryMakeStub = Sinon.stub(factory, 'make')
      factoryMakeStub.returns('anything')

      const findTargetKeyNameStub = Sinon.stub(factory, 'findForeignKeyName')
      findTargetKeyNameStub.returns('found_target_id')

      expect(factory.hasMany('Target', undefined, 'id')).toEqual('anything')
      expect(findTargetKeyNameStub.calledWith(targetModel, rootModel)).toBe(true)
      expect(
        factoryMakeStub.calledWith('NajsEloquent.Relation.Relationship.HasMany', ['Target', 'found_target_id', 'id'])
      ).toBe(true)

      makeStub.restore()
    })

    it('calls .getPrimaryKeyName() to find rootKeyName if the localKey is not found', function() {
      const rootModel: any = {
        getPrimaryKeyName() {
          return 'found_id'
        }
      }
      const factory = new RelationshipFactory(rootModel, 'test')

      const makeStub = Sinon.stub(factory, 'make')
      makeStub.returns('anything')

      expect(factory.hasMany('Target', 'target_id')).toEqual('anything')
      expect(
        makeStub.calledWith('NajsEloquent.Relation.Relationship.HasMany', ['Target', 'target_id', 'found_id'])
      ).toBe(true)
    })
  })

  describe('.belongsTo()', function() {
    it('calls .make() with class "NajsEloquent.Relation.Relationship.BelongsTo"', function() {
      const rootModel: any = {
        getPrimaryKeyName() {
          return 'id'
        }
      }
      const targetModel: any = {
        getModelName() {
          return 'Target'
        },
        formatAttributeName(name: string) {
          return 'found_' + name
        }
      }
      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.returns(targetModel)

      const factory = new RelationshipFactory(rootModel, 'test')

      const factoryMakeStub = Sinon.stub(factory, 'make')
      factoryMakeStub.returns('anything')

      const findTargetKeyNameStub = Sinon.stub(factory, 'findForeignKeyName')
      findTargetKeyNameStub.returns('test')

      expect(factory.belongsTo('Target', 'id', 'target_id')).toEqual('anything')
      expect(findTargetKeyNameStub.called).toBe(false)
      expect(
        factoryMakeStub.calledWith('NajsEloquent.Relation.Relationship.BelongsTo', ['Target', 'id', 'target_id'])
      ).toBe(true)

      makeStub.restore()
    })

    it('calls target.getPrimaryKeyName() to find targetKeyName if the targetKey is not found', function() {
      const rootModel: any = {
        getPrimaryKeyName() {
          return 'id'
        }
      }
      const targetModel: any = {
        getPrimaryKeyName() {
          return 'id'
        },
        getModelName() {
          return 'Target'
        },
        formatAttributeName(name: string) {
          return 'found_' + name
        }
      }
      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.returns(targetModel)

      const factory = new RelationshipFactory(rootModel, 'test')

      const factoryMakeStub = Sinon.stub(factory, 'make')
      factoryMakeStub.returns('anything')

      const findTargetKeyNameStub = Sinon.stub(factory, 'findForeignKeyName')
      findTargetKeyNameStub.returns('test')

      expect(factory.belongsTo('Target', undefined, 'target_id')).toEqual('anything')
      expect(findTargetKeyNameStub.called).toBe(false)
      expect(
        factoryMakeStub.calledWith('NajsEloquent.Relation.Relationship.BelongsTo', ['Target', 'id', 'target_id'])
      ).toBe(true)

      makeStub.restore()
    })

    it('calls findForeignKeyName() with rootModel & targetModel to find rootKeyName if rootKeyName not found', function() {
      const rootModel: any = {
        getPrimaryKeyName() {
          return 'id'
        }
      }
      const targetModel: any = {
        getPrimaryKeyName() {
          return 'id'
        },
        getModelName() {
          return 'Target'
        },
        formatAttributeName(name: string) {
          return 'found_' + name
        }
      }
      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.returns(targetModel)

      const factory = new RelationshipFactory(rootModel, 'test')

      const factoryMakeStub = Sinon.stub(factory, 'make')
      factoryMakeStub.returns('anything')

      const findTargetKeyNameStub = Sinon.stub(factory, 'findForeignKeyName')
      findTargetKeyNameStub.returns('test')

      expect(factory.belongsTo('Target', 'id', undefined)).toEqual('anything')
      expect(findTargetKeyNameStub.calledWith(rootModel, targetModel)).toBe(true)
      expect(factoryMakeStub.calledWith('NajsEloquent.Relation.Relationship.BelongsTo', ['Target', 'id', 'test'])).toBe(
        true
      )

      makeStub.restore()
    })
  })

  describe('.findPivotTableName()', function() {
    it('formats the model name by .formatAttributeName() of each model, then sort and join with _, pluralizes the result', function() {
      const dataset = [
        {
          a: { name: 'LongNamespace.Is.Okay.Name', formatted: 'NAME' },
          b: { name: 'LongNamespace.Is.Okay.Book', formatted: 'book' },
          result: 'book_NAMES'
        },
        {
          a: { name: 'NajsEloquent.User', formatted: 'user' },
          b: { name: 'Najs.Role', formatted: 'role' },
          result: 'role_users'
        },
        {
          a: { name: 'NajsEloquent.User', formatted: 'user' },
          b: { name: 'Najs.User', formatted: 'user' },
          result: 'user_users'
        },
        {
          a: { name: 'NajsEloquent.Account', formatted: 'account' },
          b: { name: 'Najs.Company', formatted: 'company' },
          result: 'account_companies'
        }
      ]
      for (const data of dataset) {
        const a: any = {
          formatAttributeName(name: string) {
            return data.a.formatted
          },
          getModelName() {
            return data.a.name
          }
        }

        const b: any = {
          formatAttributeName(name: string) {
            return data.b.formatted
          },
          getModelName() {
            return data.b.name
          }
        }

        const rootModel: any = {}
        const factory = new RelationshipFactory(rootModel, 'test')
        expect(factory.findPivotTableName(a, b)).toEqual(data.result)
        expect(factory.findPivotTableName(b, a)).toEqual(data.result)
      }
    })
  })

  describe('.findPivotReferenceName()', function() {
    it('returns the modelName formatted by .formatAttributeName() with the _id in the end', function() {
      const dataset = [
        { name: 'User', result: 'User_id' },
        { name: 'LongNameSpace.Company', result: 'Company_id' },
        { name: 'LongNameSpace.Anything', result: 'Anything_id' }
      ]
      for (const data of dataset) {
        const model: any = {
          formatAttributeName(name: string) {
            return 'formatted-' + name
          },
          getModelName() {
            return data.name
          }
        }

        const rootModel: any = {}
        const factory = new RelationshipFactory(rootModel, 'test')
        expect(factory.findPivotReferenceName(model)).toEqual('formatted-' + data.result)
      }
    })
  })

  describe('.belongsToMany()', function() {
    it('creates pivot via .findPivotTableName() if pivot is not found', function() {
      const makeStub = Sinon.stub(NajsBinding, 'make')
      const targetModel: any = {
        getModelName() {
          return 'Target'
        },
        formatAttributeName(name: string) {
          return name
        }
      }

      const rootModel: any = {
        getModelName() {
          return 'Root'
        },
        formatAttributeName(name: string) {
          return name
        }
      }

      makeStub.returns(targetModel)

      const factory = new RelationshipFactory(rootModel, 'test')
      const spy = Sinon.spy(factory, 'findPivotTableName')

      const thisMakeStub = Sinon.stub(factory, 'make')
      factory.belongsToMany('Target', undefined, 'pivot_target_id', 'pivot_root_id', 'id', 'id')
      expect(
        thisMakeStub.calledWith('NajsEloquent.Relation.Relationship.BelongsToMany', [
          'Target',
          'Root_Targets',
          'pivot_target_id',
          'pivot_root_id',
          'id',
          'id'
        ])
      ).toBe(true)
      expect(spy.calledWith(targetModel, rootModel)).toBe(true)
      makeStub.restore()
    })

    it('creates pivotTargetKeyName via .findPivotReferenceName() if pivotTargetKeyName is not found', function() {
      const makeStub = Sinon.stub(NajsBinding, 'make')
      const targetModel: any = {
        getModelName() {
          return 'Target'
        },
        formatAttributeName(name: string) {
          return name
        }
      }

      const rootModel: any = {
        getModelName() {
          return 'Root'
        },
        formatAttributeName(name: string) {
          return name
        }
      }

      makeStub.returns(targetModel)

      const factory = new RelationshipFactory(rootModel, 'test')
      const spy = Sinon.spy(factory, 'findPivotReferenceName')

      const thisMakeStub = Sinon.stub(factory, 'make')
      factory.belongsToMany('Target', 'pivot', undefined, 'pivot_root_id', 'id', 'id')
      expect(
        thisMakeStub.calledWith('NajsEloquent.Relation.Relationship.BelongsToMany', [
          'Target',
          'pivot',
          'Target_id',
          'pivot_root_id',
          'id',
          'id'
        ])
      ).toBe(true)
      expect(spy.calledWith(targetModel)).toBe(true)
      makeStub.restore()
    })

    it('creates pivotRootKeyName via .findPivotReferenceName() if pivotRootKeyName is not found', function() {
      const makeStub = Sinon.stub(NajsBinding, 'make')
      const targetModel: any = {
        getModelName() {
          return 'Target'
        },
        formatAttributeName(name: string) {
          return name
        }
      }

      const rootModel: any = {
        getModelName() {
          return 'Root'
        },
        formatAttributeName(name: string) {
          return name
        }
      }

      makeStub.returns(targetModel)

      const factory = new RelationshipFactory(rootModel, 'test')
      const spy = Sinon.spy(factory, 'findPivotReferenceName')

      const thisMakeStub = Sinon.stub(factory, 'make')
      factory.belongsToMany('Target', 'pivot', 'pivot_target_id', undefined, 'id', 'id')
      expect(
        thisMakeStub.calledWith('NajsEloquent.Relation.Relationship.BelongsToMany', [
          'Target',
          'pivot',
          'pivot_target_id',
          'Root_id',
          'id',
          'id'
        ])
      ).toBe(true)
      expect(spy.calledWith(rootModel)).toBe(true)
      makeStub.restore()
    })

    it('creates targetKeyName via targetModel.getPrimaryKey() if targetKeyName is not found', function() {
      const makeStub = Sinon.stub(NajsBinding, 'make')
      const targetModel: any = {
        getModelName() {
          return 'Target'
        },
        formatAttributeName(name: string) {
          return name
        },
        getPrimaryKeyName() {
          return 'anything'
        }
      }

      const rootModel: any = {
        getModelName() {
          return 'Root'
        },
        formatAttributeName(name: string) {
          return name
        }
      }

      makeStub.returns(targetModel)

      const factory = new RelationshipFactory(rootModel, 'test')

      const thisMakeStub = Sinon.stub(factory, 'make')
      factory.belongsToMany('Target', 'pivot', 'pivot_target_id', 'pivot_root_id', undefined, 'id')
      expect(
        thisMakeStub.calledWith('NajsEloquent.Relation.Relationship.BelongsToMany', [
          'Target',
          'pivot',
          'pivot_target_id',
          'pivot_root_id',
          'anything',
          'id'
        ])
      ).toBe(true)
      makeStub.restore()
    })

    it('creates rootKeyName via rootModel.getPrimaryKey() if rootKeyName is not found', function() {
      const makeStub = Sinon.stub(NajsBinding, 'make')
      const targetModel: any = {
        getModelName() {
          return 'Target'
        },
        formatAttributeName(name: string) {
          return name
        }
      }

      const rootModel: any = {
        getModelName() {
          return 'Root'
        },
        formatAttributeName(name: string) {
          return name
        },
        getPrimaryKeyName() {
          return 'anything'
        }
      }

      makeStub.returns(targetModel)

      const factory = new RelationshipFactory(rootModel, 'test')

      const thisMakeStub = Sinon.stub(factory, 'make')
      factory.belongsToMany('Target', 'pivot', 'pivot_target_id', 'pivot_root_id', 'id', undefined)
      expect(
        thisMakeStub.calledWith('NajsEloquent.Relation.Relationship.BelongsToMany', [
          'Target',
          'pivot',
          'pivot_target_id',
          'pivot_root_id',
          'id',
          'anything'
        ])
      ).toBe(true)
      makeStub.restore()
    })

    it('finally returns a BelongsToMany relationship', function() {
      const makeStub = Sinon.stub(NajsBinding, 'make')
      const targetModel: any = {
        getModelName() {
          return 'Target'
        },
        formatAttributeName(name: string) {
          return name
        }
      }

      const rootModel: any = {
        getModelName() {
          return 'Root'
        },
        formatAttributeName(name: string) {
          return name
        }
      }

      makeStub.returns(targetModel)

      const factory = new RelationshipFactory(rootModel, 'test')

      const thisMakeStub = Sinon.stub(factory, 'make')
      factory.belongsToMany('Target', 'pivot', 'pivot_target_id', 'pivot_root_id', 'id', 'id')
      expect(
        thisMakeStub.calledWith('NajsEloquent.Relation.Relationship.BelongsToMany', [
          'Target',
          'pivot',
          'pivot_target_id',
          'pivot_root_id',
          'id',
          'id'
        ])
      ).toBe(true)
      makeStub.restore()
    })
  })

  describe('.morphOne()', function() {
    it('creates MorphOne instance with name_type & name_id formatted by targetModel if there are 2 params', function() {
      const makeStub = Sinon.stub(NajsBinding, 'make')
      const targetModel: any = {
        getModelName() {
          return 'Target'
        },
        formatAttributeName(name: string) {
          return 'formatted_' + name
        }
      }
      makeStub.returns(targetModel)

      const rootModel: any = {
        getPrimaryKeyName() {
          return 'id'
        }
      }

      const factory = new RelationshipFactory(rootModel, 'test')
      const thisMakeStub = Sinon.stub(factory, 'make')
      factory.morphOne('Target', 'field')
      expect(
        thisMakeStub.calledWith('NajsEloquent.Relation.Relationship.MorphOne', [
          'Target',
          'formatted_field_type',
          'formatted_field_id',
          'id'
        ])
      ).toBe(true)
      makeStub.restore()
    })

    it('creates MorphOne instance with given name_type & name_id if there are 3 params', function() {
      const makeStub = Sinon.stub(NajsBinding, 'make')
      const targetModel: any = {
        getModelName() {
          return 'Target'
        },
        formatAttributeName(name: string) {
          return 'formatted_' + name
        }
      }
      makeStub.returns(targetModel)

      const rootModel: any = {
        getPrimaryKeyName() {
          return 'id'
        }
      }

      const factory = new RelationshipFactory(rootModel, 'test')
      const thisMakeStub = Sinon.stub(factory, 'make')
      factory.morphOne('Target', 'field_type', 'field_id')
      expect(
        thisMakeStub.calledWith('NajsEloquent.Relation.Relationship.MorphOne', [
          'Target',
          'field_type',
          'field_id',
          'id'
        ])
      ).toBe(true)
      makeStub.restore()
    })

    it('creates MorphOne instance with given name_type & name_id and root id if there are 4 params', function() {
      const makeStub = Sinon.stub(NajsBinding, 'make')
      const targetModel: any = {
        getModelName() {
          return 'Target'
        },
        formatAttributeName(name: string) {
          return 'formatted_' + name
        }
      }
      makeStub.returns(targetModel)

      const rootModel: any = {
        getPrimaryKeyName() {
          return 'id'
        }
      }

      const factory = new RelationshipFactory(rootModel, 'test')
      const thisMakeStub = Sinon.stub(factory, 'make')
      factory.morphOne('Target', 'field_type', 'field_id', 'root')
      expect(
        thisMakeStub.calledWith('NajsEloquent.Relation.Relationship.MorphOne', [
          'Target',
          'field_type',
          'field_id',
          'root'
        ])
      ).toBe(true)
      makeStub.restore()
    })
  })

  describe('.morphMany()', function() {
    it('creates MorphOne instance with name_type & name_id formatted by targetModel if there are 2 params', function() {
      const makeStub = Sinon.stub(NajsBinding, 'make')
      const targetModel: any = {
        getModelName() {
          return 'Target'
        },
        formatAttributeName(name: string) {
          return 'formatted_' + name
        }
      }
      makeStub.returns(targetModel)

      const rootModel: any = {
        getPrimaryKeyName() {
          return 'id'
        }
      }

      const factory = new RelationshipFactory(rootModel, 'test')
      const thisMakeStub = Sinon.stub(factory, 'make')
      factory.morphMany('Target', 'field')
      expect(
        thisMakeStub.calledWith('NajsEloquent.Relation.Relationship.MorphMany', [
          'Target',
          'formatted_field_type',
          'formatted_field_id',
          'id'
        ])
      ).toBe(true)
      makeStub.restore()
    })

    it('creates MorphOne instance with given name_type & name_id if there are 3 params', function() {
      const makeStub = Sinon.stub(NajsBinding, 'make')
      const targetModel: any = {
        getModelName() {
          return 'Target'
        },
        formatAttributeName(name: string) {
          return 'formatted_' + name
        }
      }
      makeStub.returns(targetModel)

      const rootModel: any = {
        getPrimaryKeyName() {
          return 'id'
        }
      }

      const factory = new RelationshipFactory(rootModel, 'test')
      const thisMakeStub = Sinon.stub(factory, 'make')
      factory.morphMany('Target', 'field_type', 'field_id')
      expect(
        thisMakeStub.calledWith('NajsEloquent.Relation.Relationship.MorphMany', [
          'Target',
          'field_type',
          'field_id',
          'id'
        ])
      ).toBe(true)
      makeStub.restore()
    })

    it('creates MorphOne instance with given name_type & name_id and root id if there are 4 params', function() {
      const makeStub = Sinon.stub(NajsBinding, 'make')
      const targetModel: any = {
        getModelName() {
          return 'Target'
        },
        formatAttributeName(name: string) {
          return 'formatted_' + name
        }
      }
      makeStub.returns(targetModel)

      const rootModel: any = {
        getPrimaryKeyName() {
          return 'id'
        }
      }

      const factory = new RelationshipFactory(rootModel, 'test')
      const thisMakeStub = Sinon.stub(factory, 'make')
      factory.morphMany('Target', 'field_type', 'field_id', 'root')
      expect(
        thisMakeStub.calledWith('NajsEloquent.Relation.Relationship.MorphMany', [
          'Target',
          'field_type',
          'field_id',
          'root'
        ])
      ).toBe(true)
      makeStub.restore()
    })
  })

  describe('.morphTo()', function() {
    it('creates MorphTo with generated rootType & rootKey base of name of relation if there is no params', function() {
      const rootModel: any = {
        getModelName() {
          return 'Target'
        },
        formatAttributeName(name: string) {
          return 'formatted_' + name
        }
      }

      const factory = new RelationshipFactory(rootModel, 'name')
      const thisMakeStub = Sinon.stub(factory, 'make')
      factory.morphTo()
      expect(
        thisMakeStub.calledWith('NajsEloquent.Relation.Relationship.MorphTo', [
          'formatted_name_type',
          'formatted_name_id',
          {}
        ])
      ).toBe(true)
    })

    it('creates MorphTo with custom rootType and rootKey if there are 2 params', function() {
      const rootModel: any = {
        getModelName() {
          return 'Target'
        },
        formatAttributeName(name: string) {
          return 'formatted_' + name
        }
      }

      const factory = new RelationshipFactory(rootModel, 'name')
      const thisMakeStub = Sinon.stub(factory, 'make')
      factory.morphTo('morph_type', 'morph_id')
      expect(
        thisMakeStub.calledWith('NajsEloquent.Relation.Relationship.MorphTo', ['morph_type', 'morph_id', {}])
      ).toBe(true)
    })

    it('creates MorphTo with custom rootType and rootKey and targetKeyMap if there are 3 params', function() {
      const rootModel: any = {
        getModelName() {
          return 'Target'
        },
        formatAttributeName(name: string) {
          return 'formatted_' + name
        }
      }

      const factory = new RelationshipFactory(rootModel, 'name')
      const thisMakeStub = Sinon.stub(factory, 'make')
      factory.morphTo('morph_type', 'morph_id', { a: 'test' })
      expect(
        thisMakeStub.calledWith('NajsEloquent.Relation.Relationship.MorphTo', ['morph_type', 'morph_id', { a: 'test' }])
      ).toBe(true)
    })
  })
})
