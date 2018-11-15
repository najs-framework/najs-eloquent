/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/relations/IRelationship.ts" />

import IModel = NajsEloquent.Model.IModel
import RelationDefinition = NajsEloquent.Relation.RelationDefinition
import RelationDefinitions = NajsEloquent.Relation.RelationDefinitions

import { Relationship } from './Relationship'
import { EventPublicApi } from '../features/mixin/EventPublicApi'
import { FillablePublicApi } from '../features/mixin/FillablePublicApi'
import { RecordManagerPublicApi } from '../features/mixin/RecordManagerPublicApi'
import { RelationPublicApi } from '../features/mixin/RelationPublicApi'
import { SerializationPublicApi } from '../features/mixin/SerializationPublicApi'
import { SoftDeletesPublicApi } from '../features/mixin/SoftDeletesPublicApi'
import { TimestampsPublicApi } from '../features/mixin/TimestampsPublicApi'
import { PrototypeManager } from '../util/PrototypeManager'

const PublicApiList = ['constructor', 'sharedMetadata'].concat(
  Object.getOwnPropertyNames(EventPublicApi),
  Object.getOwnPropertyNames(FillablePublicApi),
  Object.getOwnPropertyNames(RecordManagerPublicApi),
  Object.getOwnPropertyNames(RelationPublicApi),
  Object.getOwnPropertyNames(SerializationPublicApi),
  Object.getOwnPropertyNames(SoftDeletesPublicApi),
  Object.getOwnPropertyNames(TimestampsPublicApi)
)

export class RelationDefinitionFinder {
  model: IModel
  prototype: object
  bases: object[]

  constructor(model: IModel, prototype: object, bases: object[]) {
    this.model = model
    this.prototype = prototype
    this.bases = bases
  }

  getDefinitions() {
    return [this.prototype, ...this.bases]
      .map(prototype => {
        if (!PrototypeManager.shouldFindRelationsIn(prototype)) {
          return {}
        }
        return this.findDefinitionsInPrototype(prototype)
      })
      .reduce((memo: RelationDefinitions, definitions: RelationDefinitions) => {
        const targets = Object.keys(definitions)
        if (targets.length === 0) {
          return memo
        }

        for (const target of targets) {
          const definition = definitions[target]
          if (typeof memo[definition.accessor] !== 'undefined') {
            this.warning(definition, memo[definition.accessor])
            continue
          }

          memo[definition.accessor] = definition
        }

        return memo
      }, {})
  }

  findDefinitionsInPrototype(prototype: object) {
    const descriptors = Object.getOwnPropertyDescriptors(prototype)

    const className = typeof prototype['getClassName'] === 'function' ? prototype['getClassName']() : undefined
    return Object.keys(descriptors).reduce((value, name) => {
      if (name === '' || PublicApiList.indexOf(name) !== -1) {
        return value
      }

      const definition = this.findDefinition(name, descriptors[name], className)
      if (definition) {
        value[name] = definition
      }

      return value
    }, {})
  }

  findDefinition(target: string, descriptor: PropertyDescriptor, className?: string): RelationDefinition | undefined {
    try {
      if (typeof descriptor.value === 'function') {
        const relation = descriptor.value!.call(this.model)
        if (relation instanceof Relationship) {
          return {
            target: target,
            accessor: relation.getName(),
            targetType: 'function',
            targetClass: className
          }
        }
      }

      if (typeof descriptor.get === 'function') {
        const relation = descriptor.get!.call(this.model)
        if (relation instanceof Relationship) {
          return {
            accessor: relation.getName(),
            target: target,
            targetType: 'getter',
            targetClass: className
          }
        }
      }
    } catch (error) {
      // console.error(error)
    }
    return undefined
  }

  warning(definition: RelationDefinition, definedDefinition: RelationDefinition) {
    console.warn(
      `The ${this.formatTargetName(definition)} redefines a relation on property`,
      `"${definition.accessor}"`,
      `which already defined by ${this.formatTargetName(definedDefinition)}`
    )
  }

  formatTargetName(definition: RelationDefinition) {
    const target = definition.targetType === 'function' ? `${definition.target}()` : `${definition.target}`
    const className = !!definition.targetClass ? definition.targetClass + '.' : ''
    return `"${className + target}"`
  }
}
