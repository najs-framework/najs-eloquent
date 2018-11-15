"use strict";
/// <reference path="../../definitions/collect.js/index.d.ts" />
/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/data/IDataReader.ts" />
/// <reference path="../../definitions/relations/IRelationship.ts" />
/// <reference path="../../definitions/relations/IRelationDataBucket.ts" />
/// <reference path="../../definitions/relations/IBelongsToManyRelationship.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
// import { flatten } from 'lodash'
const najs_binding_1 = require("najs-binding");
const ManyToMany_1 = require("./ManyToMany");
const RelationshipType_1 = require("../RelationshipType");
const constants_1 = require("../../constants");
// import { isModel, isCollection } from '../../util/helpers'
const ModelEvent_1 = require("../../model/ModelEvent");
const RelationUtilities_1 = require("../RelationUtilities");
const factory_1 = require("../../util/factory");
const DataConditionMatcher_1 = require("../../data/DataConditionMatcher");
class BelongsToMany extends ManyToMany_1.ManyToMany {
    getType() {
        return RelationshipType_1.RelationshipType.BelongsToMany;
    }
    getClassName() {
        return constants_1.NajsEloquent.Relation.Relationship.BelongsToMany;
    }
    collectPivotData(dataBucket) {
        const rootPrimaryKey = this.rootModel.getAttribute(this.rootKeyName);
        if (!rootPrimaryKey) {
            return {};
        }
        const dataBuffer = dataBucket.getDataOf(this.pivotModel);
        const reader = dataBuffer.getDataReader();
        const raw = dataBuffer
            .getCollector()
            .filterBy({
            $and: [new DataConditionMatcher_1.DataConditionMatcher(this.pivotRootKeyName, '=', rootPrimaryKey, reader)]
        })
            .exec();
        const pivotTargetKeyName = this.pivotTargetKeyName;
        return raw.reduce(function (memo, item) {
            const targetPrimaryKey = reader.getAttribute(item, pivotTargetKeyName);
            memo[targetPrimaryKey.toString()] = item;
            return memo;
        }, {});
    }
    collectData() {
        const dataBucket = this.getDataBucket();
        if (!dataBucket) {
            return factory_1.make_collection([]);
        }
        const pivotData = this.collectPivotData(dataBucket);
        const dataBuffer = dataBucket.getDataOf(this.targetModel);
        const reader = dataBuffer.getDataReader();
        const collector = dataBuffer.getCollector().filterBy({
            $and: [new DataConditionMatcher_1.DataConditionMatcher(this.targetKeyName, 'in', Object.keys(pivotData), reader)]
        });
        const pivotModel = this.pivotModel;
        return factory_1.make_collection(collector.exec(), item => {
            const instance = dataBucket.makeModel(this.targetModel, item);
            const targetPrimaryKey = reader.getAttribute(item, this.targetKeyName).toString();
            const pivotAccessor = this.getPivotAccessor();
            instance[pivotAccessor] = dataBucket.makeModel(pivotModel, pivotData[targetPrimaryKey]);
            instance.makeHidden(pivotAccessor);
            return instance;
        });
    }
    async fetchPivotData(type) {
        const name = `${this.getType()}Pivot:${this.targetModel.getModelName()}-${this.rootModel.getModelName()}`;
        if (type === 'lazy') {
            return this.newPivotQuery(name).get();
        }
        const dataBucket = this.getDataBucket();
        if (!dataBucket) {
            return factory_1.make_collection([]);
        }
        const query = this.newPivotQuery(name, true);
        const ids = RelationUtilities_1.RelationUtilities.getAttributeListInDataBucket(dataBucket, this.rootModel, this.rootKeyName);
        return query.whereIn(this.pivotRootKeyName, ids).get();
    }
    async fetchData(type) {
        const pivotData = await this.fetchPivotData(type);
        const queryName = `${this.getType()}:${this.targetModel.getModelName()}-${this.rootModel.getModelName()}`;
        const query = this.createTargetQuery(queryName);
        const targetKeysInPivot = pivotData.map(item => item.getAttribute(this.pivotTargetKeyName)).all();
        return query.whereIn(this.targetKeyName, targetKeysInPivot).get();
    }
    async attach(arg1, arg2) {
        const input = this.parseAttachArguments(arg1, arg2);
        const promises = [];
        for (const id in input) {
            const result = this.attachModel(id, input[id]);
            if (typeof result === 'undefined') {
                continue;
            }
            promises.push(result);
        }
        if (promises.length === 0) {
            return this;
        }
        await Promise.all(promises);
        return this;
    }
    parseAttachArguments(arg1, arg2) {
        if (typeof arg1 === 'string') {
            return { [arg1]: arg2 };
        }
        if (Array.isArray(arg1)) {
            return arg1.reduce(function (memo, item) {
                memo[item] = arg2;
                return memo;
            }, {});
        }
        return arg1;
    }
    attachModel(targetId, data) {
        const pivot = this.newPivot();
        pivot.setAttribute(this.pivotTargetKeyName, targetId);
        if (typeof data !== 'undefined') {
            pivot.fill(data);
        }
        const rootPrimaryKey = this.rootModel.getAttribute(this.rootKeyName);
        if (rootPrimaryKey) {
            pivot.setAttribute(this.pivotRootKeyName, rootPrimaryKey);
            return pivot.save();
        }
        this.rootModel.once(ModelEvent_1.ModelEvent.Saved, async () => {
            pivot.setAttribute(this.pivotRootKeyName, this.rootModel.getAttribute(this.rootKeyName));
            await pivot.save();
        });
        return undefined;
    }
    async detach(targetIds) {
        if (!this.hasRootPrimaryKey('detach')) {
            return this;
        }
        const ids = Array.isArray(targetIds) ? targetIds : [targetIds];
        if (ids.length === 0) {
            return this;
        }
        await Promise.all(ids.map((targetId) => {
            return this.newPivotQuery()
                .where(this.pivotTargetKeyName, targetId)
                .delete();
        }));
        return this;
    }
    parseSyncArg2AndArg3(result, id, arg2, arg3) {
        if (typeof arg2 === 'object') {
            result.data[id] = arg2;
            result.detaching = typeof arg3 === 'boolean' ? arg3 : true;
            return result;
        }
        result.data[id] = undefined;
        result.detaching = typeof arg2 === 'boolean' ? arg2 : true;
        return result;
    }
    parseSyncArguments(arg1, arg2, arg3) {
        const result = {
            data: {},
            detaching: true
        };
        if (typeof arg1 === 'string') {
            return this.parseSyncArg2AndArg3(result, arg1, arg2, arg3);
        }
        if (Array.isArray(arg1)) {
            return arg1.reduce((memo, item) => {
                return this.parseSyncArg2AndArg3(memo, item, arg2, arg3);
            }, result);
        }
        result.data = arg1;
        result.detaching = typeof arg2 === 'boolean' ? arg2 : true;
        return result;
    }
    async sync(arg1, arg2, arg3) {
        if (!this.hasRootPrimaryKey('sync')) {
            return this;
        }
        const args = this.parseSyncArguments(arg1, arg2, arg3);
        const pivots = (await this.newPivotQuery().get()).keyBy(this.pivotTargetKeyName);
        const syncKeys = Object.keys(args.data);
        if (args.detaching) {
            await this.detach(
            // prettier-ignore
            pivots.keys().all().filter(function (targetId) {
                return syncKeys.indexOf(targetId) === -1;
            }));
        }
        await Promise.all(syncKeys.map((targetId) => {
            if (pivots.has(targetId)) {
                return this.newPivotQuery()
                    .where(this.pivotTargetKeyName, targetId)
                    .update(args.data[targetId] || {});
            }
            return this.attachModel(targetId, args.data[targetId]);
        }));
        return this;
    }
    hasRootPrimaryKey(func) {
        const rootPrimaryKey = this.rootModel.getAttribute(this.rootKeyName);
        if (!rootPrimaryKey) {
            console.warn(`Relation: Could not use .${func}() with new Model.`);
            return false;
        }
        return true;
    }
}
BelongsToMany.className = constants_1.NajsEloquent.Relation.Relationship.BelongsToMany;
exports.BelongsToMany = BelongsToMany;
najs_binding_1.register(BelongsToMany, constants_1.NajsEloquent.Relation.Relationship.BelongsToMany);
