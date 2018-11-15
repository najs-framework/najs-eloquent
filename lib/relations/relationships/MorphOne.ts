/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/relations/IRelationship.ts" />
/// <reference path="../../definitions/data/IDataCollector.ts" />
/// <reference path="../../definitions/query-builders/IQueryBuilder.ts" />
/// <reference path="../../definitions/relations/IMorphOneRelationship.ts" />

import Model = NajsEloquent.Model.IModel
import ModelDefinition = NajsEloquent.Model.ModelDefinition
import IMorphOneRelationship = NajsEloquent.Relation.IMorphOneRelationship

import { register } from 'najs-binding'
import { HasOneOrMany } from './HasOneOrMany'
import { RelationshipType } from '../RelationshipType'
import { NajsEloquent as NajsEloquentClasses } from '../../constants'
import { HasOneExecutor } from './executors/HasOneExecutor'
import { MorphOneOrManyExecutor } from './executors/MorphOneOrManyExecutor'
import { RelationUtilities } from '../RelationUtilities'

export class MorphOne<T extends Model> extends HasOneOrMany<T> implements IMorphOneRelationship<T> {
  static className: string = NajsEloquentClasses.Relation.Relationship.MorphOne
  protected targetMorphTypeName: string
  protected executor: MorphOneOrManyExecutor<T>

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
    return NajsEloquentClasses.Relation.Relationship.MorphOne
  }

  getType(): string {
    return RelationshipType.MorphOne
  }

  getExecutor(): MorphOneOrManyExecutor<T> {
    if (!this.executor) {
      this.executor = new MorphOneOrManyExecutor<T>(
        new HasOneExecutor<T>(this.getDataBucket()!, this.targetModel),
        this.targetMorphTypeName,
        HasOneOrMany.findMorphType(this.rootModel)
      )
    }
    return this.executor
  }

  associate(model: T) {
    RelationUtilities.associateOne(model, this.rootModel, this.rootKeyName, target => {
      target.setAttribute(this.targetKeyName, this.rootModel.getAttribute(this.rootKeyName))
      target.setAttribute(this.targetMorphTypeName, MorphOne.findMorphType(this.rootModel.getModelName()))
    })
  }
}
register(MorphOne, NajsEloquentClasses.Relation.Relationship.MorphOne)
