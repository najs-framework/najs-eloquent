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
// // import { flatten } from 'lodash'
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
function find_relations_in_prototype(instance, prototype, relations) {
    const descriptors = Object.getOwnPropertyDescriptors(prototype);
    for (const name in descriptors) {
        if (name === 'constructor' || name === 'hasAttribute') {
            continue;
        }
        try {
            const result = get_value_and_type_of_property(descriptors[name], instance);
            if (!result || !(result['value'] instanceof Relation_1.Relation)) {
                continue;
            }
            relations[result['relationName']] = {
                mappedTo: name,
                type: result['type']
            };
        }
        catch (error) {
            continue;
        }
    }
}
function findRelationsForModel(model) {
    const relations = {};
    const modelPrototype = Object.getPrototypeOf(model);
    find_relations_in_prototype(model, modelPrototype, relations);
    const basePrototypes = functions_1.find_base_prototypes(modelPrototype, Eloquent_1.Eloquent.prototype);
    for (const prototype of basePrototypes) {
        if (prototype !== Eloquent_1.Eloquent.prototype) {
            find_relations_in_prototype(model, prototype, relations);
        }
    }
    Object.defineProperty(modelPrototype, 'relations', {
        value: relations
    });
}
exports.findRelationsForModel = findRelationsForModel;
class ModelRelation {
    getClassName() {
        return constants_1.NajsEloquent.Model.Component.ModelRelation;
    }
    extend(prototype, bases, driver) {
        prototype['load'] = ModelRelation.load;
        prototype['getRelationByName'] = ModelRelation.getRelationByName;
        prototype['defineRelationProperty'] = ModelRelation.defineRelationProperty;
    }
    static callMappedRelationByName(model, name) {
        if (typeof model['relations'] === 'undefined' || typeof model['relations'][name] === 'undefined') {
            throw new Error(`Relation "${name}" is not found in model "${model.getModelName()}".`);
        }
        const mapping = model['relations'][name];
        if (mapping.type === 'getter') {
            return model[mapping.mapTo];
        }
        return model[mapping.mapTo].call(model);
    }
}
ModelRelation.className = constants_1.NajsEloquent.Model.Component.ModelRelation;
ModelRelation.load = async function () {
    console.warn('Relation feature is not available until v0.4.0');
    // const relations: string[] = flatten(arguments)
    // for (const relationName of relations) {
    //   this.getRelationByName(relationName).lazyLoad(this)
    // }
    // return this
};
ModelRelation.getRelationByName = function (name) {
    console.warn('Relation feature is not available until v0.4.0');
    // const relationNames = name.split('.')
    // for (const relationName of relationNames) {
    //   return this[relationName]
    // }
    return ModelRelation.callMappedRelationByName(this, name);
};
ModelRelation.defineRelationProperty = function (name) {
    console.warn('Relation feature is not available until v0.4.0');
    if (this['__sample']) {
        this['relationName'] = name;
    }
    // TODO: always returns RelationFactory
    return new RelationFactory_1.RelationFactory();
};
exports.ModelRelation = ModelRelation;
najs_binding_1.register(ModelRelation);
