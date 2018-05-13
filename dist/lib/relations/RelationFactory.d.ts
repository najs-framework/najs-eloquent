/// <reference path="../model/interfaces/IModel.d.ts" />
/// <reference path="interfaces/IRelation.d.ts" />
/// <reference path="interfaces/IRelationFactory.d.ts" />
export declare class RelationFactory implements NajsEloquent.Relation.IRelationFactory {
    protected rootModel: NajsEloquent.Model.IModel<any>;
    protected relation: NajsEloquent.Relation.IRelation;
    protected name: string;
    protected loaded: boolean;
    constructor(rootModel: NajsEloquent.Model.IModel<any>, name: string);
    hasOne(model: string | NajsEloquent.Model.ModelDefinition<any>, key?: string, foreignKey?: string): any;
}
