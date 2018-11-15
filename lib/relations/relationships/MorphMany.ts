/// <reference path="../../definitions/collect.js/index.d.ts" />
/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/relations/IRelationship.ts" />
/// <reference path="../../definitions/relations/IMorphManyRelationship.ts" />
/// <reference path="../../definitions/data/IDataCollector.ts" />
/// <reference path="../../definitions/query-builders/IQueryBuilder.ts" />

import Model = NajsEloquent.Model.IModel
import ModelDefinition = NajsEloquent.Model.ModelDefinition
import IMorphManyRelationship = NajsEloquent.Relation.IMorphManyRelationship
import Collection = CollectJs.Collection

import { register } from 'najs-binding'
import { HasOneOrMany } from './HasOneOrMany'
import { RelationshipType } from '../RelationshipType'
import { NajsEloquent as NajsEloquentClasses } from '../../constants'
import { HasManyExecutor } from './executors/HasManyExecutor'
import { MorphOneOrManyExecutor } from './executors/MorphOneOrManyExecutor'
import { RelationUtilities } from '../RelationUtilities'
import { relationFeatureOf } from '../../util/accessors'

export class MorphMany<T extends Model> extends HasOneOrMany<Collection<T>> implements IMorphManyRelationship<T> {
  static className: string = NajsEloquentClasses.Relation.Relationship.MorphMany
  protected targetMorphTypeName: string
  protected executor: MorphOneOrManyExecutor<Collection<T>>

  constructor(
    root: Model,
    relationName: string,
    target: ModelDefinition,
    targetType: string,
    targetKey: string,
    rootKey: string
  ) {
    super(root, relationName, target, targetKey, rootKey)
    this.targetMorphTypeName = targetType
  }

  getClassName(): string {
    return NajsEloquentClasses.Relation.Relationship.MorphMany
  }

  getType(): string {
    return RelationshipType.MorphMany
  }

  getExecutor(): MorphOneOrManyExecutor<Collection<T>> {
    if (!this.executor) {
      this.executor = new MorphOneOrManyExecutor(
        new HasManyExecutor<T>(this.getDataBucket()!, this.targetModel),
        this.targetMorphTypeName,
        HasOneOrMany.findMorphType(this.rootModel)
      )
    }
    return this.executor
  }

  associate(...models: Array<T | T[] | CollectJs.Collection<T>>): this {
    RelationUtilities.associateMany(models, this.rootModel, this.rootKeyName, target => {
      target.setAttribute(this.targetKeyName, this.rootModel.getAttribute(this.rootKeyName))
      target.setAttribute(this.targetMorphTypeName, MorphMany.findMorphType(this.rootModel.getModelName()))
    })
    return this
  }

  dissociate(...models: Array<T | T[] | CollectJs.Collection<T>>): this {
    RelationUtilities.dissociateMany(models, this.rootModel, this.rootKeyName, target => {
      const relationFeature = relationFeatureOf(target)
      target.setAttribute(
        this.targetKeyName,
        relationFeature.getEmptyValueForRelationshipForeignKey(target, this.targetKeyName)
      )
      target.setAttribute(
        this.targetMorphTypeName,
        relationFeature.getEmptyValueForRelationshipForeignKey(target, this.targetMorphTypeName)
      )
    })
    return this
  }
}
register(MorphMany, NajsEloquentClasses.Relation.Relationship.MorphMany)
