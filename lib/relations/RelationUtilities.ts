/// <reference path="../definitions/relations/IRelationship.ts" />
/// <reference path="../definitions/relations/IRelationDataBucket.ts" />

import Model = NajsEloquent.Model.IModel
import IRelationDataBucket = NajsEloquent.Relation.IRelationDataBucket
import IRelationship = NajsEloquent.Relation.IRelationship

import { flatten } from 'lodash'
import { Relationship } from './Relationship'
import { ModelEvent } from './../model/ModelEvent'
import { isCollection } from '../util/helpers'

export const RelationUtilities = {
  bundleRelations(relations: IRelationship<any>[]): IRelationship<any>[] {
    return Object.values(
      relations.reduce(
        function(memo, relation) {
          if (typeof memo[relation.getName()] === 'undefined') {
            memo[relation.getName()] = relation
          } else {
            memo[relation.getName()].with(relation.getChains())
          }
          return memo
        },
        {} as { [key in string]: IRelationship<any> }
      )
    )
  },

  isLoadedInDataBucket<T>(relationship: Relationship<T>, model: Model, name: string) {
    const bucket = relationship.getDataBucket()
    if (!bucket) {
      return false
    }

    return bucket.getMetadataOf(model).loaded.indexOf(name) !== -1
  },

  markLoadedInDataBucket<T>(relationship: Relationship<T>, model: Model, name: string) {
    const bucket = relationship.getDataBucket()
    if (!bucket) {
      return
    }

    bucket.getMetadataOf(model).loaded.push(name)
  },

  getAttributeListInDataBucket(dataBucket: IRelationDataBucket, model: Model, attribute: string) {
    const dataBuffer = dataBucket.getDataOf(model)
    const reader = dataBuffer.getDataReader()
    return dataBuffer.map(item => reader.getAttribute(item, attribute))
  },

  associateOne(model: Model, rootModel: Model, rootKeyName: string, setTargetAttributes: (model: Model) => void) {
    // root provides primary key for target, whenever the root get saved target should be updated as well
    const primaryKey = rootModel.getAttribute(rootKeyName)
    if (!primaryKey) {
      rootModel.once(ModelEvent.Saved, async () => {
        setTargetAttributes(model)
        await model.save()
      })
      return
    }

    setTargetAttributes(model)
    rootModel.once(ModelEvent.Saved, async () => {
      await model.save()
    })
  },

  flattenModels(models: Array<Model | Model[] | CollectJs.Collection<Model>>): Model[] {
    return flatten(
      models.map(item => {
        return isCollection(item) ? (item as CollectJs.Collection<Model>).all() : (item as Model | Model[])
      })
    )
  },

  associateMany(
    models: Array<Model | Model[] | CollectJs.Collection<Model>>,
    rootModel: Model,
    rootKeyName: string,
    setTargetAttributes: (model: Model) => void
  ) {
    // root provides primary key for target, whenever the root get saved target should be updated as well
    const associatedModels: Model[] = this.flattenModels(models)

    const primaryKey = rootModel.getAttribute(rootKeyName)
    if (!primaryKey) {
      rootModel.once(ModelEvent.Saved, async () => {
        await Promise.all(
          associatedModels.map(function(model) {
            setTargetAttributes(model)
            return model.save()
          })
        )
      })
      return
    }

    associatedModels.forEach(setTargetAttributes)
    rootModel.once(ModelEvent.Saved, async () => {
      await Promise.all(associatedModels.map(model => model.save()))
    })
  },

  dissociateMany(
    models: Array<Model | Model[] | CollectJs.Collection<Model>>,
    rootModel: Model,
    rootKeyName: string,
    setTargetAttributes: (model: Model) => void
  ) {
    const dissociatedModels: Model[] = RelationUtilities.flattenModels(models)

    const primaryKey = rootModel.getAttribute(rootKeyName)
    if (!primaryKey) {
      rootModel.once(ModelEvent.Saved, async () => {
        dissociatedModels.forEach(setTargetAttributes)
        await Promise.all(dissociatedModels.map(model => model.save()))
      })
      return
    }

    dissociatedModels.forEach(setTargetAttributes)
    rootModel.once(ModelEvent.Saved, async () => {
      await Promise.all(dissociatedModels.map(model => model.save()))
    })
  }
}
