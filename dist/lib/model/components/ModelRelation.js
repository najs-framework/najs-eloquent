"use strict";
/// <reference path="../../contracts/Component.ts" />
/// <reference path="../interfaces/IModel.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const constants_1 = require("../../constants");
const Relation_1 = require("./../../relations/Relation");
const RelationFactory_1 = require("../../relations/RelationFactory");
const Eloquent_1 = require("../Eloquent");
const functions_1 = require("../../util/functions");
const lodash_1 = require("lodash");
function get_value_and_type_of_property(descriptor, instance) {
    // perform getter or function for sample, the sample will contains "relationName"
    const sample = instance['getClassSetting']().getSample();
    if (typeof descriptor.value === 'function') {
        descriptor.value.call(sample);
        return {
            value: descriptor.value.call(instance),
            relationName: sample.relationName,
            type: 'function'
        };
    }
    if (typeof descriptor.get === 'function') {
        descriptor.get.call(sample);
        return {
            value: descriptor.get.call(instance),
            relationName: sample.relationName,
            type: 'getter'
        };
    }
    return undefined;
}
function find_relation(name, descriptor, instance, relationsMap) {
    try {
        const result = get_value_and_type_of_property(descriptor, instance);
        if (result && result['value'] instanceof Relation_1.Relation) {
            relationsMap[result['relationName']] = {
                mapTo: name,
                type: result['type']
            };
        }
    }
    catch (error) {
        // console.error(error)
    }
}
function find_relations_in_prototype(instance, prototype, relationsMap) {
    const descriptors = Object.getOwnPropertyDescriptors(prototype);
    for (const name in descriptors) {
        if (name === 'constructor' || name === 'hasAttribute') {
            continue;
        }
        find_relation(name, descriptors[name], instance, relationsMap);
    }
}
function findRelationsMapForModel(model) {
    const relationsMap = {};
    const modelPrototype = Object.getPrototypeOf(model);
    find_relations_in_prototype(model, modelPrototype, relationsMap);
    const basePrototypes = functions_1.find_base_prototypes(modelPrototype, Eloquent_1.Eloquent.prototype);
    for (const prototype of basePrototypes) {
        if (prototype !== Eloquent_1.Eloquent.prototype) {
            find_relations_in_prototype(model, prototype, relationsMap);
        }
    }
    Object.defineProperty(modelPrototype, 'relationsMap', {
        value: relationsMap
    });
}
exports.findRelationsMapForModel = findRelationsMapForModel;
function define_relation_property_if_needed(model, name) {
    const prototype = Object.getPrototypeOf(model);
    const propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, name);
    if (propertyDescriptor) {
        return;
    }
    Object.defineProperty(prototype, name, {
        get: function () {
            if (typeof this['relationsMap'][name] === 'undefined') {
                throw new Error(`Relation "${name}" is not defined in model "${this.getModelName()}".`);
            }
            return this.getRelationByName(name).getData();
        }
    });
}
class ModelRelation {
    getClassName() {
        return constants_1.NajsEloquent.Model.Component.ModelRelation;
    }
    extend(prototype, bases, driver) {
        prototype['load'] = ModelRelation.load;
        prototype['getRelationByName'] = ModelRelation.getRelationByName;
        prototype['defineRelationProperty'] = ModelRelation.defineRelationProperty;
        prototype['getRelationDataBucket'] = ModelRelation.getRelationDataBucket;
    }
}
ModelRelation.className = constants_1.NajsEloquent.Model.Component.ModelRelation;
ModelRelation.getRelationDataBucket = function () {
    return this['relationDataBucket'];
};
ModelRelation.load = async function () {
    const relations = lodash_1.flatten(arguments);
    for (const relationName of relations) {
        await this.getRelationByName(relationName).load();
    }
};
ModelRelation.getRelationByName = function (name) {
    const info = functions_1.parse_string_with_dot_notation(name);
    if (typeof this['relationsMap'] === 'undefined' || typeof this['relationsMap'][info.first] === 'undefined') {
        throw new Error(`Relation "${info.first}" is not found in model "${this.getModelName()}".`);
    }
    const mapping = this['relationsMap'][info.first];
    const relation = mapping.type === 'getter' ? this[mapping.mapTo] : this[mapping.mapTo].call(this);
    if (info.afterFirst) {
        relation.with(info.afterFirst);
    }
    return relation;
};
ModelRelation.defineRelationProperty = function (name) {
    if (this['__sample']) {
        this['relationName'] = name;
        return new RelationFactory_1.RelationFactory(this, name, true);
    }
    if (typeof this['relations'][name] === 'undefined') {
        define_relation_property_if_needed(this, name);
        this['relations'][name] = {
            factory: new RelationFactory_1.RelationFactory(this, name, false)
        };
    }
    return this['relations'][name].factory;
};
exports.ModelRelation = ModelRelation;
najs_binding_1.register(ModelRelation);
