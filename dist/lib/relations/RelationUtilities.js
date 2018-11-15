"use strict";
/// <reference path="../definitions/relations/IRelationship.ts" />
/// <reference path="../definitions/relations/IRelationDataBucket.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const ModelEvent_1 = require("./../model/ModelEvent");
const helpers_1 = require("../util/helpers");
exports.RelationUtilities = {
    bundleRelations(relations) {
        return Object.values(relations.reduce(function (memo, relation) {
            if (typeof memo[relation.getName()] === 'undefined') {
                memo[relation.getName()] = relation;
            }
            else {
                memo[relation.getName()].with(relation.getChains());
            }
            return memo;
        }, {}));
    },
    isLoadedInDataBucket(relationship, model, name) {
        const bucket = relationship.getDataBucket();
        if (!bucket) {
            return false;
        }
        return bucket.getMetadataOf(model).loaded.indexOf(name) !== -1;
    },
    markLoadedInDataBucket(relationship, model, name) {
        const bucket = relationship.getDataBucket();
        if (!bucket) {
            return;
        }
        bucket.getMetadataOf(model).loaded.push(name);
    },
    getAttributeListInDataBucket(dataBucket, model, attribute) {
        const dataBuffer = dataBucket.getDataOf(model);
        const reader = dataBuffer.getDataReader();
        return dataBuffer.map(item => reader.getAttribute(item, attribute));
    },
    associateOne(model, rootModel, rootKeyName, setTargetAttributes) {
        // root provides primary key for target, whenever the root get saved target should be updated as well
        const primaryKey = rootModel.getAttribute(rootKeyName);
        if (!primaryKey) {
            rootModel.once(ModelEvent_1.ModelEvent.Saved, async () => {
                setTargetAttributes(model);
                await model.save();
            });
            return;
        }
        setTargetAttributes(model);
        rootModel.once(ModelEvent_1.ModelEvent.Saved, async () => {
            await model.save();
        });
    },
    flattenModels(models) {
        return lodash_1.flatten(models.map(item => {
            return helpers_1.isCollection(item) ? item.all() : item;
        }));
    },
    associateMany(models, rootModel, rootKeyName, setTargetAttributes) {
        // root provides primary key for target, whenever the root get saved target should be updated as well
        const associatedModels = this.flattenModels(models);
        const primaryKey = rootModel.getAttribute(rootKeyName);
        if (!primaryKey) {
            rootModel.once(ModelEvent_1.ModelEvent.Saved, async () => {
                await Promise.all(associatedModels.map(function (model) {
                    setTargetAttributes(model);
                    return model.save();
                }));
            });
            return;
        }
        associatedModels.forEach(setTargetAttributes);
        rootModel.once(ModelEvent_1.ModelEvent.Saved, async () => {
            await Promise.all(associatedModels.map(model => model.save()));
        });
    },
    dissociateMany(models, rootModel, rootKeyName, setTargetAttributes) {
        const dissociatedModels = exports.RelationUtilities.flattenModels(models);
        const primaryKey = rootModel.getAttribute(rootKeyName);
        if (!primaryKey) {
            rootModel.once(ModelEvent_1.ModelEvent.Saved, async () => {
                dissociatedModels.forEach(setTargetAttributes);
                await Promise.all(dissociatedModels.map(model => model.save()));
            });
            return;
        }
        dissociatedModels.forEach(setTargetAttributes);
        rootModel.once(ModelEvent_1.ModelEvent.Saved, async () => {
            await Promise.all(dissociatedModels.map(model => model.save()));
        });
    }
};
