/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/relations/IRelationship.ts" />
/// <reference path="../definitions/relations/IRelationshipFactory.ts" />
/// <reference path="../definitions/relations/IHasOneRelationship.ts" />
/// <reference path="../definitions/relations/IBelongsToManyRelationship.ts" />
/// <reference path="../definitions/relations/IMorphOneRelationship.ts" />
/// <reference path="../definitions/relations/IMorphManyRelationship.ts" />
/// <reference path="../definitions/relations/IMorphToRelationship.ts" />

import IModel = NajsEloquent.Model.IModel
import ModelDefinition = NajsEloquent.Model.ModelDefinition
import IRelationship = NajsEloquent.Relation.IRelationship
import IRelationshipFactory = NajsEloquent.Relation.IRelationshipFactory
import IHasOne = NajsEloquent.Relation.IHasOneRelationship
import IBelongsTo = NajsEloquent.Relation.IBelongsToRelationship
import IHasMany = NajsEloquent.Relation.IHasManyRelationship
import IBelongsToMany = NajsEloquent.Relation.IBelongsToManyRelationship
import IMorphOne = NajsEloquent.Relation.IMorphOneRelationship
import IMorphMany = NajsEloquent.Relation.IMorphManyRelationship
import IMorphTo = NajsEloquent.Relation.IMorphToRelationship

import * as pluralize from 'pluralize'
import { make } from 'najs-binding'
import { parse_string_with_dot_notation } from '../util/functions'
import { HasOne } from './relationships/HasOne'
import { BelongsTo } from './relationships/BelongsTo'
import { HasMany } from './relationships/HasMany'
import { BelongsToMany } from './relationships/BelongsToMany'
import { MorphOne } from './relationships/MorphOne'
import { MorphMany } from './relationships/MorphMany'
import { MorphTo } from './relationships/MorphTo'

export class RelationshipFactory implements IRelationshipFactory {
  protected rootModel: IModel
  protected name: string
  protected relationship: IRelationship<any>

  constructor(rootModel: IModel, name: string) {
    this.rootModel = rootModel
    this.name = name
  }

  make<T extends IRelationship<any>>(className: string, params: any[], modifier?: (relation: T) => void): T {
    if (!this.relationship) {
      this.relationship = make<T>(className, [this.rootModel, this.name, ...params])

      if (modifier) {
        modifier(this.relationship as T)
      }
    }

    return this.relationship as T
  }

  findForeignKeyName(referencing: IModel, referenced: IModel) {
    const referencedNameParts = parse_string_with_dot_notation(referenced.getModelName())

    return referencing.formatAttributeName(referencedNameParts.last + '_id')
  }

  protected makeHasOneOrMany(className: string, target: ModelDefinition<any>, targetKey?: string, localKey?: string) {
    const targetKeyName =
      typeof targetKey === 'undefined' ? this.findForeignKeyName(make<IModel>(target), this.rootModel) : targetKey
    const rootKeyName = typeof localKey === 'undefined' ? this.rootModel.getPrimaryKeyName() : localKey

    return this.make(className, [target, targetKeyName, rootKeyName])
  }

  hasOne<T extends IModel>(target: ModelDefinition<any>, targetKey?: string, localKey?: string): IHasOne<T> {
    return this.makeHasOneOrMany(HasOne.className, target, targetKey, localKey) as HasOne<T>
  }

  hasMany<T extends IModel>(target: ModelDefinition<any>, targetKey?: string, localKey?: string): IHasMany<T> {
    return this.makeHasOneOrMany(HasMany.className, target, targetKey, localKey) as HasMany<T>
  }

  belongsTo<T extends IModel>(target: ModelDefinition<any>, targetKey?: string, localKey?: string): IBelongsTo<T> {
    const targetModel = make<IModel>(target)
    const targetKeyName = typeof targetKey === 'undefined' ? targetModel.getPrimaryKeyName() : targetKey
    const rootKeyName =
      typeof localKey === 'undefined' ? this.findForeignKeyName(this.rootModel, targetModel) : localKey

    return this.make<BelongsTo<T>>(BelongsTo.className, [target, targetKeyName, rootKeyName])
  }

  findPivotTableName(a: IModel, b: IModel) {
    const names = [
      a.formatAttributeName(parse_string_with_dot_notation(a.getModelName()).last),
      b.formatAttributeName(parse_string_with_dot_notation(b.getModelName()).last)
    ]

    return pluralize(
      names
        .sort(function(a, b) {
          const comparedA = a.toLowerCase()
          const comparedB = b.toLowerCase()
          if (comparedA === comparedB) {
            return 0
          }
          return comparedA > comparedB ? 1 : -1
        })
        .join('_')
    )
  }

  findPivotReferenceName(model: IModel) {
    const targetName = parse_string_with_dot_notation(model.getModelName()).last

    return model.formatAttributeName(targetName + '_id')
  }

  belongsToMany<T extends IModel>(
    target: Definition<T>,
    pivot?: Definition<any>,
    pivotTargetKeyName?: string,
    pivotRootKeyName?: string,
    targetKeyName?: string,
    rootKeyName?: string
  ): IBelongsToMany<T> {
    const targetModel = make<IModel>(target)
    if (!pivot) {
      pivot = this.findPivotTableName(targetModel, this.rootModel)
    }

    if (!pivotTargetKeyName) {
      pivotTargetKeyName = this.findPivotReferenceName(targetModel)
    }

    if (!pivotRootKeyName) {
      pivotRootKeyName = this.findPivotReferenceName(this.rootModel)
    }

    if (!targetKeyName) {
      targetKeyName = targetModel.getPrimaryKeyName()
    }

    if (!rootKeyName) {
      rootKeyName = this.rootModel.getPrimaryKeyName()
    }

    return this.make<BelongsToMany<T>>(BelongsToMany.className, [
      target,
      pivot,
      pivotTargetKeyName,
      pivotRootKeyName,
      targetKeyName,
      rootKeyName
    ])
  }

  protected makeMorphOneOrMany(
    className: string,
    target: Definition<any>,
    targetType: string,
    targetKey?: string,
    localKey?: string
  ) {
    const targetModel = make<IModel>(target)

    const prefix = targetType
    if (typeof targetKey === 'undefined') {
      targetType = targetModel.formatAttributeName(prefix + '_type')
      targetKey = targetModel.formatAttributeName(prefix + '_id')
    }

    if (typeof localKey === 'undefined') {
      localKey = this.rootModel.getPrimaryKeyName()
    }

    return this.make(className, [target, targetType, targetKey, localKey])
  }

  morphOne<T extends IModel>(target: Definition<T>, name: string, targetKey?: string, localKey?: string): IMorphOne<T> {
    return this.makeMorphOneOrMany(MorphOne.className, target, name, targetKey, localKey) as MorphOne<T>
  }

  morphMany<T extends IModel>(
    target: Definition<T>,
    name: string,
    targetKey?: string,
    localKey?: string
  ): IMorphMany<T> {
    return this.makeMorphOneOrMany(MorphMany.className, target, name, targetKey, localKey) as MorphMany<T>
  }

  morphTo<T extends IModel>(
    rootType?: string,
    rootKey?: string,
    targetKeyMap?: { [name in string]: string }
  ): IMorphTo<T> {
    if (typeof rootType === 'undefined' && typeof rootKey === 'undefined') {
      rootType = this.rootModel.formatAttributeName(this.name + '_type')
      rootKey = this.rootModel.formatAttributeName(this.name + '_id')
    }

    if (typeof targetKeyMap === 'undefined') {
      targetKeyMap = {}
    }
    return this.make<MorphTo<T>>(MorphTo.className, [rootType, rootKey, targetKeyMap])
  }
}
