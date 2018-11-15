"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RelationshipType;
(function (RelationshipType) {
    RelationshipType["HasOne"] = "HasOne";
    RelationshipType["HasMany"] = "HasMany";
    RelationshipType["BelongsTo"] = "BelongsTo";
    RelationshipType["BelongsToMany"] = "BelongsToMany";
    RelationshipType["MorphOne"] = "MorphOne";
    RelationshipType["MorphMany"] = "MorphMany";
    RelationshipType["MorphTo"] = "MorphTo";
})(RelationshipType = exports.RelationshipType || (exports.RelationshipType = {}));
