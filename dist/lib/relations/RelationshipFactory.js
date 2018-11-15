"use strict";
/// <reference path="../definitions/model/IModel.ts" />
/// <reference path="../definitions/relations/IRelationship.ts" />
/// <reference path="../definitions/relations/IRelationshipFactory.ts" />
/// <reference path="../definitions/relations/IHasOneRelationship.ts" />
/// <reference path="../definitions/relations/IBelongsToManyRelationship.ts" />
/// <reference path="../definitions/relations/IMorphOneRelationship.ts" />
/// <reference path="../definitions/relations/IMorphManyRelationship.ts" />
/// <reference path="../definitions/relations/IMorphToRelationship.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize = require("pluralize");
const najs_binding_1 = require("najs-binding");
const functions_1 = require("../util/functions");
const HasOne_1 = require("./relationships/HasOne");
const BelongsTo_1 = require("./relationships/BelongsTo");
const HasMany_1 = require("./relationships/HasMany");
const BelongsToMany_1 = require("./relationships/BelongsToMany");
const MorphOne_1 = require("./relationships/MorphOne");
const MorphMany_1 = require("./relationships/MorphMany");
const MorphTo_1 = require("./relationships/MorphTo");
class RelationshipFactory {
    constructor(rootModel, name) {
        this.rootModel = rootModel;
        this.name = name;
    }
    make(className, params, modifier) {
        if (!this.relationship) {
            this.relationship = najs_binding_1.make(className, [this.rootModel, this.name, ...params]);
            if (modifier) {
                modifier(this.relationship);
            }
        }
        return this.relationship;
    }
    findForeignKeyName(referencing, referenced) {
        const referencedNameParts = functions_1.parse_string_with_dot_notation(referenced.getModelName());
        return referencing.formatAttributeName(referencedNameParts.last + '_id');
    }
    makeHasOneOrMany(className, target, targetKey, localKey) {
        const targetKeyName = typeof targetKey === 'undefined' ? this.findForeignKeyName(najs_binding_1.make(target), this.rootModel) : targetKey;
        const rootKeyName = typeof localKey === 'undefined' ? this.rootModel.getPrimaryKeyName() : localKey;
        return this.make(className, [target, targetKeyName, rootKeyName]);
    }
    hasOne(target, targetKey, localKey) {
        return this.makeHasOneOrMany(HasOne_1.HasOne.className, target, targetKey, localKey);
    }
    hasMany(target, targetKey, localKey) {
        return this.makeHasOneOrMany(HasMany_1.HasMany.className, target, targetKey, localKey);
    }
    belongsTo(target, targetKey, localKey) {
        const targetModel = najs_binding_1.make(target);
        const targetKeyName = typeof targetKey === 'undefined' ? targetModel.getPrimaryKeyName() : targetKey;
        const rootKeyName = typeof localKey === 'undefined' ? this.findForeignKeyName(this.rootModel, targetModel) : localKey;
        return this.make(BelongsTo_1.BelongsTo.className, [target, targetKeyName, rootKeyName]);
    }
    findPivotTableName(a, b) {
        const names = [
            a.formatAttributeName(functions_1.parse_string_with_dot_notation(a.getModelName()).last),
            b.formatAttributeName(functions_1.parse_string_with_dot_notation(b.getModelName()).last)
        ];
        return pluralize(names
            .sort(function (a, b) {
            const comparedA = a.toLowerCase();
            const comparedB = b.toLowerCase();
            if (comparedA === comparedB) {
                return 0;
            }
            return comparedA > comparedB ? 1 : -1;
        })
            .join('_'));
    }
    findPivotReferenceName(model) {
        const targetName = functions_1.parse_string_with_dot_notation(model.getModelName()).last;
        return model.formatAttributeName(targetName + '_id');
    }
    belongsToMany(target, pivot, pivotTargetKeyName, pivotRootKeyName, targetKeyName, rootKeyName) {
        const targetModel = najs_binding_1.make(target);
        if (!pivot) {
            pivot = this.findPivotTableName(targetModel, this.rootModel);
        }
        if (!pivotTargetKeyName) {
            pivotTargetKeyName = this.findPivotReferenceName(targetModel);
        }
        if (!pivotRootKeyName) {
            pivotRootKeyName = this.findPivotReferenceName(this.rootModel);
        }
        if (!targetKeyName) {
            targetKeyName = targetModel.getPrimaryKeyName();
        }
        if (!rootKeyName) {
            rootKeyName = this.rootModel.getPrimaryKeyName();
        }
        return this.make(BelongsToMany_1.BelongsToMany.className, [
            target,
            pivot,
            pivotTargetKeyName,
            pivotRootKeyName,
            targetKeyName,
            rootKeyName
        ]);
    }
    makeMorphOneOrMany(className, target, targetType, targetKey, localKey) {
        const targetModel = najs_binding_1.make(target);
        const prefix = targetType;
        if (typeof targetKey === 'undefined') {
            targetType = targetModel.formatAttributeName(prefix + '_type');
            targetKey = targetModel.formatAttributeName(prefix + '_id');
        }
        if (typeof localKey === 'undefined') {
            localKey = this.rootModel.getPrimaryKeyName();
        }
        return this.make(className, [target, targetType, targetKey, localKey]);
    }
    morphOne(target, name, targetKey, localKey) {
        return this.makeMorphOneOrMany(MorphOne_1.MorphOne.className, target, name, targetKey, localKey);
    }
    morphMany(target, name, targetKey, localKey) {
        return this.makeMorphOneOrMany(MorphMany_1.MorphMany.className, target, name, targetKey, localKey);
    }
    morphTo(rootType, rootKey, targetKeyMap) {
        if (typeof rootType === 'undefined' && typeof rootKey === 'undefined') {
            rootType = this.rootModel.formatAttributeName(this.name + '_type');
            rootKey = this.rootModel.formatAttributeName(this.name + '_id');
        }
        if (typeof targetKeyMap === 'undefined') {
            targetKeyMap = {};
        }
        return this.make(MorphTo_1.MorphTo.className, [rootType, rootKey, targetKeyMap]);
    }
}
exports.RelationshipFactory = RelationshipFactory;
