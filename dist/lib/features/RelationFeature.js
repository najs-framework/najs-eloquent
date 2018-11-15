"use strict";
/// <reference path="../definitions/data/IDataReader.ts" />
/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/features/IRelationFeature.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const FeatureBase_1 = require("./FeatureBase");
const constants_1 = require("../constants");
const RelationDataBucket_1 = require("../relations/RelationDataBucket");
const RelationData_1 = require("../relations/RelationData");
const RelationshipFactory_1 = require("../relations/RelationshipFactory");
const RelationPublicApi_1 = require("./mixin/RelationPublicApi");
const RelationNotDefinedError_1 = require("../errors/RelationNotDefinedError");
const RelationDefinitionFinder_1 = require("../relations/RelationDefinitionFinder");
const RecordDataReader_1 = require("../drivers/RecordDataReader");
const functions_1 = require("../util/functions");
const RelationUtilities_1 = require("../relations/RelationUtilities");
class RelationFeature extends FeatureBase_1.FeatureBase {
    getPublicApi() {
        return RelationPublicApi_1.RelationPublicApi;
    }
    getFeatureName() {
        return 'Relation';
    }
    getClassName() {
        return constants_1.NajsEloquent.Feature.RelationFeature;
    }
    makeDataBucket(model) {
        return new RelationDataBucket_1.RelationDataBucket();
    }
    makeFactory(model, accessor) {
        return new RelationshipFactory_1.RelationshipFactory(model, accessor);
    }
    getDataBucket(model) {
        return this.useInternalOf(model).internalData.relationDataBucket;
    }
    setDataBucket(model, dataBucket) {
        this.useInternalOf(model).internalData.relationDataBucket = dataBucket;
    }
    createKeyForDataBucket(model) {
        return this.useRecordManagerOf(model).getRecordName(model);
    }
    getDataReaderForDataBucket() {
        return RecordDataReader_1.RecordDataReader;
    }
    getRawDataForDataBucket(model) {
        return this.useRecordManagerOf(model).getRecord(model);
    }
    getEmptyValueForRelationshipForeignKey(model, key) {
        // tslint:disable-next-line
        return null;
    }
    getEmptyValueForSerializedRelation(model, key) {
        // tslint:disable-next-line
        return null;
    }
    getDefinitions(model) {
        return this.useInternalOf(model).sharedMetadata.relationDefinitions;
    }
    buildDefinitions(model, prototype, bases) {
        const finder = new RelationDefinitionFinder_1.RelationDefinitionFinder(model, prototype, bases);
        return finder.getDefinitions();
    }
    findByName(model, name) {
        const internalModel = this.useInternalOf(model);
        const info = functions_1.parse_string_with_dot_notation(name);
        if (typeof internalModel.sharedMetadata === 'undefined' ||
            typeof internalModel.sharedMetadata.relationDefinitions === 'undefined' ||
            typeof internalModel.sharedMetadata.relationDefinitions[info.first] === 'undefined') {
            throw new RelationNotDefinedError_1.RelationNotDefinedError(info.first, internalModel.getModelName());
        }
        const definition = internalModel.sharedMetadata.relationDefinitions[info.first];
        const relation = definition.targetType === 'getter'
            ? internalModel[definition.target]
            : internalModel[definition.target].call(this);
        if (info.afterFirst) {
            relation.with(info.afterFirst);
        }
        return relation;
    }
    findDataByName(model, name) {
        const internalModel = this.useInternalOf(model);
        if (typeof internalModel.internalData.relations[name] === 'undefined') {
            internalModel.internalData.relations[name] = new RelationData_1.RelationData(this.makeFactory(model, name));
            this.defineAccessor(model, name);
        }
        return internalModel.internalData.relations[name];
    }
    isLoadedRelation(model, relation) {
        return this.findByName(model, relation).isLoaded();
    }
    getLoadedRelations(model) {
        const definitions = this.getDefinitions(model);
        const loaded = Object.keys(definitions).reduce((memo, name) => {
            const relation = this.findByName(model, name);
            if (relation.isLoaded()) {
                memo.push(relation);
            }
            return memo;
        }, []);
        return RelationUtilities_1.RelationUtilities.bundleRelations(loaded);
    }
    defineAccessor(model, accessor) {
        const prototype = Object.getPrototypeOf(model);
        const propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, accessor);
        if (!propertyDescriptor) {
            Object.defineProperty(prototype, accessor, {
                get: function () {
                    return this.getRelation(accessor).getData();
                }
            });
        }
    }
}
exports.RelationFeature = RelationFeature;
najs_binding_1.register(RelationFeature, constants_1.NajsEloquent.Feature.RelationFeature);
