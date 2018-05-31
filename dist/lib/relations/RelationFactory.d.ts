/// <reference path="../model/interfaces/IModel.d.ts" />
/// <reference path="interfaces/IRelation.d.ts" />
/// <reference path="interfaces/IRelationFactory.d.ts" />
import './HasOneOrMany';
import { RelationInfo, HasOneOrMany } from './HasOneOrMany';
import { RelationType } from './RelationType';
export declare class RelationFactory implements NajsEloquent.Relation.IRelationFactory {
    protected rootModel: NajsEloquent.Model.IModel<any>;
    protected relation: NajsEloquent.Relation.IRelation;
    protected name: string;
    protected isSample: boolean;
    constructor(rootModel: NajsEloquent.Model.IModel<any>, name: string, isSample: boolean);
    hasOne(model: string | NajsEloquent.Model.ModelDefinition<any>, foreignKey?: string, localKey?: string): any;
    hasMany(model: string | NajsEloquent.Model.ModelDefinition<any>, foreignKey?: string, localKey?: string): any;
    protected hasOneOrMany(is1v1: boolean, model: string | NajsEloquent.Model.ModelDefinition<any>, foreignKey?: string, localKey?: string): {};
    belongsTo(model: string | NajsEloquent.Model.ModelDefinition<any>, foreignKey?: string, localKey?: string): any;
    setupHasOneOrMany(oneToOne: boolean, local: RelationInfo, foreign: RelationInfo, type: RelationType): HasOneOrMany;
    setupRelation(className: string, setup: () => NajsEloquent.Relation.IRelation): {};
    getModelByNameOrDefinition(model: string | Function): NajsEloquent.Model.IModel<any>;
}
