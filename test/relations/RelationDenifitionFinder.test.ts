import 'jest'
import * as Sinon from 'sinon'
import { register } from 'najs-binding'
import { Model } from '../../lib/model/Model'
import { MemoryDriver } from '../../lib/drivers/memory/MemoryDriver'
import { DriverProvider } from '../../lib/facades/global/DriverProviderFacade'
import { find_base_prototypes } from '../../lib/util/functions'
import { RelationDefinitionFinder } from '../../lib/relations/RelationDefinitionFinder'

DriverProvider.register(MemoryDriver, 'memory', true)

describe('RelationDefinitionFinder', function() {
  it('can find definition which defined via function', function() {
    class DefinedViaFunction extends Model {
      getClassName() {
        return 'DefinedViaFunction'
      }

      getTestRelation() {
        return this.defineRelation('test' as any).hasOne('Target', 'target_id', 'id')
      }

      getAnotherRelation() {
        return this.defineRelation('another' as any).hasOne('Target', 'target_id', 'id')
      }

      getSkipRelation() {
        return 'invalid'
      }
    }
    register(DefinedViaFunction)

    const model = new DefinedViaFunction()
    const prototype = DefinedViaFunction.prototype
    const bases = find_base_prototypes(prototype, Object.prototype)

    const finder = new RelationDefinitionFinder(model, prototype, bases)
    expect(finder.getDefinitions()).toEqual({
      test: {
        accessor: 'test',
        target: 'getTestRelation',
        targetType: 'function',
        targetClass: 'DefinedViaFunction'
      },
      another: {
        accessor: 'another',
        target: 'getAnotherRelation',
        targetType: 'function',
        targetClass: 'DefinedViaFunction'
      }
    })
  })

  it('can find definition which defined via getter', function() {
    class DefinedViaGetter extends Model {
      static className = 'DefinedViaGetter'

      get testRelation() {
        return this.defineRelation('test' as any).hasOne('Target', 'target_id', 'id')
      }

      get anotherRelation() {
        return this.defineRelation('another' as any).hasOne('Target', 'target_id', 'id')
      }

      get skipRelation() {
        return 'invalid'
      }
    }
    register(DefinedViaGetter)

    const model = new DefinedViaGetter()
    const prototype = DefinedViaGetter.prototype
    const bases = find_base_prototypes(prototype, Object.prototype)

    const finder = new RelationDefinitionFinder(model, prototype, bases)
    expect(finder.getDefinitions()).toEqual({
      test: {
        accessor: 'test',
        target: 'testRelation',
        targetType: 'getter'
      },
      another: {
        accessor: 'another',
        target: 'anotherRelation',
        targetType: 'getter'
      }
    })
  })

  it('can skip function/getter which throws error', function() {
    class SkipErrorDefinitions extends Model {
      static className = 'SkipErrorDefinitions'

      getTestErrorRelation() {
        throw new Error('any')
      }

      get anotherErrorRelation() {
        throw new Error('any')
      }

      get testRelation() {
        return this.defineRelation('test' as any).hasOne('Target', 'target_id', 'id')
      }
    }
    register(SkipErrorDefinitions)

    const model = new SkipErrorDefinitions()
    const prototype = SkipErrorDefinitions.prototype
    const bases = find_base_prototypes(prototype, Object.prototype)

    const finder = new RelationDefinitionFinder(model, prototype, bases)
    expect(finder.getDefinitions()).toEqual({
      test: {
        accessor: 'test',
        target: 'testRelation',
        targetType: 'getter'
      }
    })
  })

  it('can find definition which defined in parent class', function() {
    class DefinedParent extends Model {
      getTestRelation() {
        return this.defineRelation('test' as any).hasOne('Target', 'target_id', 'id')
      }
    }

    class DefinedChild extends DefinedParent {
      static className = 'DefinedChild'

      get anotherRelation() {
        return this.defineRelation('another' as any).hasOne('Target', 'target_id', 'id')
      }

      get skipRelation() {
        return 'invalid'
      }
    }
    register(DefinedChild)

    const model = new DefinedChild()
    const prototype = DefinedChild.prototype
    const bases = find_base_prototypes(prototype, Object.prototype)

    const finder = new RelationDefinitionFinder(model, prototype, bases)
    expect(finder.getDefinitions()).toEqual({
      test: {
        accessor: 'test',
        target: 'getTestRelation',
        targetType: 'function'
      },
      another: {
        accessor: 'another',
        target: 'anotherRelation',
        targetType: 'getter'
      }
    })
  })

  it('can warning if the relation function redefine under the same property', function() {
    class RedefinedProperty extends Model {
      static className = 'RedefinedProperty'

      getTestRelation() {
        return this.defineRelation('test' as any).hasOne('Target', 'target_id', 'id')
      }

      getAnotherRelation() {
        return this.defineRelation('test' as any).hasOne('Target', 'target_id', 'id')
      }
    }
    register(RedefinedProperty)

    const model = new RedefinedProperty()
    const prototype = RedefinedProperty.prototype
    const bases = find_base_prototypes(prototype, Object.prototype)

    const finder = new RelationDefinitionFinder(model, prototype, bases)
    const warnStub = Sinon.stub(console, 'warn')
    const warningSpy = Sinon.spy(finder, 'warning')

    expect(finder.getDefinitions()).toEqual({
      test: {
        accessor: 'test',
        target: 'getTestRelation',
        targetType: 'function'
      }
    })
    expect(
      warningSpy.calledWith(
        {
          target: 'getAnotherRelation',
          targetType: 'function',
          accessor: 'test',
          targetClass: undefined
        },
        {
          target: 'getTestRelation',
          targetType: 'function',
          accessor: 'test',
          targetClass: undefined
        }
      )
    ).toBe(true)
    warnStub.restore()
    warningSpy.restore()
  })

  describe('.formatTargetName()', function() {
    it('returns formatted target name of the definition', function() {
      const dataset = [
        {
          input: {
            target: 'getTestRelation',
            targetType: 'function',
            accessor: 'test',
            targetClass: 'Class'
          },
          output: '"Class.getTestRelation()"'
        },
        {
          input: {
            target: 'testRelation',
            targetType: 'getter',
            accessor: 'test',
            targetClass: 'Class'
          },
          output: '"Class.testRelation"'
        },
        {
          input: {
            target: 'getTestRelation',
            targetType: 'function',
            accessor: 'test'
          },
          output: '"getTestRelation()"'
        },
        {
          input: {
            target: 'testRelation',
            targetType: 'getter',
            accessor: 'test'
          },
          output: '"testRelation"'
        }
      ]

      for (const data of dataset) {
        const model: any = {}
        const finder = new RelationDefinitionFinder(model, {}, [])
        expect(finder.formatTargetName(data.input as any)).toEqual(data.output)
      }
    })
  })
})
