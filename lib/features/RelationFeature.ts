/// <reference path="../definitions/data/IDataReader.ts" />
/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/features/IRelationFeature.ts" />

import IModel = NajsEloquent.Model.IModel
import IRelation = NajsEloquent.Relation.IRelationship
import IRelationshipFactory = NajsEloquent.Relation.IRelationshipFactory
import IRelationDataBucket = NajsEloquent.Relation.IRelationDataBucket
import IRelationData = NajsEloquent.Relation.IRelationData
import RelationDefinitions = NajsEloquent.Relation.RelationDefinitions

import { register } from 'najs-binding'
import { FeatureBase } from './FeatureBase'
import { NajsEloquent as NajsEloquentClasses } from '../constants'
import { RelationDataBucket } from '../relations/RelationDataBucket'
import { RelationData } from '../relations/RelationData'
import { RelationshipFactory } from '../relations/RelationshipFactory'
import { RelationPublicApi } from './mixin/RelationPublicApi'
import { RelationNotDefinedError } from '../errors/RelationNotDefinedError'
import { RelationDefinitionFinder } from '../relations/RelationDefinitionFinder'
import { RecordDataReader } from '../drivers/RecordDataReader'
import { parse_string_with_dot_notation } from '../util/functions'
import { RelationUtilities } from '../relations/RelationUtilities'

export class RelationFeature extends FeatureBase implements NajsEloquent.Feature.IRelationFeature {
  getPublicApi(): object {
    return RelationPublicApi
  }

  getFeatureName(): string {
    return 'Relation'
  }

  getClassName(): string {
    return NajsEloquentClasses.Feature.RelationFeature
  }

  makeDataBucket(model: IModel): IRelationDataBucket {
    return new RelationDataBucket()
  }

  makeFactory(model: IModel, accessor: string): IRelationshipFactory {
    return new RelationshipFactory(model, accessor)
  }

  getDataBucket(model: NajsEloquent.Model.IModel): IRelationDataBucket | undefined {
    return this.useInternalOf(model).internalData.relationDataBucket
  }

  setDataBucket(model: NajsEloquent.Model.IModel, dataBucket: IRelationDataBucket): void {
    this.useInternalOf(model).internalData.relationDataBucket = dataBucket
  }

  createKeyForDataBucket(model: NajsEloquent.Model.IModel): string {
    return this.useRecordManagerOf(model).getRecordName(model)
  }

  getDataReaderForDataBucket(): NajsEloquent.Data.IDataReader<any> {
    return RecordDataReader
  }

  getRawDataForDataBucket<R>(model: NajsEloquent.Model.IModel): R {
    return this.useRecordManagerOf(model).getRecord(model) as R
  }

  getEmptyValueForRelationshipForeignKey(model: NajsEloquent.Model.IModel, key: string): any {
    // tslint:disable-next-line
    return null
  }

  getEmptyValueForSerializedRelation(model: NajsEloquent.Model.IModel, key: string): any {
    // tslint:disable-next-line
    return null
  }

  getDefinitions(model: IModel): RelationDefinitions {
    return this.useInternalOf(model).sharedMetadata.relationDefinitions
  }

  buildDefinitions(model: IModel, prototype: object, bases: object[]): RelationDefinitions {
    const finder = new RelationDefinitionFinder(model, prototype, bases)

    return finder.getDefinitions()
  }

  findByName<T = {}>(model: IModel, name: string): IRelation<T> {
    const internalModel = this.useInternalOf(model)

    const info = parse_string_with_dot_notation(name)
    if (
      typeof internalModel.sharedMetadata === 'undefined' ||
      typeof internalModel.sharedMetadata.relationDefinitions === 'undefined' ||
      typeof internalModel.sharedMetadata.relationDefinitions[info.first] === 'undefined'
    ) {
      throw new RelationNotDefinedError(info.first, internalModel.getModelName())
    }

    const definition = internalModel.sharedMetadata.relationDefinitions[info.first]
    const relation: IRelation<T> =
      definition.targetType === 'getter'
        ? internalModel[definition.target]
        : internalModel[definition.target].call(this)

    if (info.afterFirst) {
      relation.with(info.afterFirst)
    }
    return relation
  }

  findDataByName<T>(model: IModel, name: string): IRelationData<T> {
    const internalModel = this.useInternalOf(model)

    if (typeof internalModel.internalData.relations[name] === 'undefined') {
      internalModel.internalData.relations[name] = new RelationData(this.makeFactory(model, name))
      this.defineAccessor(model, name)
    }

    return internalModel.internalData.relations[name]
  }

  isLoadedRelation(model: IModel, relation: string): boolean {
    return this.findByName(model, relation).isLoaded()
  }

  getLoadedRelations(model: IModel): IRelation<any>[] {
    const definitions = this.getDefinitions(model)
    const loaded = Object.keys(definitions).reduce(
      (memo, name) => {
        const relation = this.findByName(model, name)
        if (relation.isLoaded()) {
          memo.push(relation)
        }
        return memo
      },
      [] as IRelation<any>[]
    )
    return RelationUtilities.bundleRelations(loaded)
  }

  defineAccessor(model: IModel, accessor: string): void {
    const prototype = Object.getPrototypeOf(model)
    const propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, accessor)
    if (!propertyDescriptor) {
      Object.defineProperty(prototype, accessor, {
        get: function(this: IModel) {
          return this.getRelation(accessor as any).getData()
        }
      })
    }
  }
}
register(RelationFeature, NajsEloquentClasses.Feature.RelationFeature)
