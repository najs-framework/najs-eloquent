/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/relations/IRelationship.ts" />
/// <reference path="../../definitions/relations/IHasOneRelationship.ts" />

import Model = NajsEloquent.Model.IModel
import IHasOneRelationship = NajsEloquent.Relation.IHasOneRelationship

import { register } from 'najs-binding'
import { HasOneOrMany } from './HasOneOrMany'
import { RelationshipType } from '../RelationshipType'
import { NajsEloquent as NajsEloquentClasses } from '../../constants'
import { RelationUtilities } from '../RelationUtilities'
import { HasOneExecutor } from './executors/HasOneExecutor'

export class HasOne<T extends Model> extends HasOneOrMany<T> implements IHasOneRelationship<T> {
  static className: string = NajsEloquentClasses.Relation.Relationship.HasOne
  protected executor: HasOneExecutor<T>

  getClassName(): string {
    return NajsEloquentClasses.Relation.Relationship.HasOne
  }

  getType(): string {
    return RelationshipType.HasOne
  }

  getExecutor(): HasOneExecutor<T> {
    if (!this.executor) {
      this.executor = new HasOneExecutor(this.getDataBucket()!, this.targetModel)
    }
    return this.executor
  }

  associate(model: T) {
    RelationUtilities.associateOne(model, this.rootModel, this.rootKeyName, target => {
      target.setAttribute(this.targetKeyName, this.rootModel.getAttribute(this.rootKeyName))
    })
  }
}
register(HasOne, NajsEloquentClasses.Relation.Relationship.HasOne)
