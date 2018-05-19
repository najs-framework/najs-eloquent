/// <reference path="../model/interfaces/IModel.d.ts" />
/// <reference path="interfaces/IRelation.d.ts" />
/// <reference path="interfaces/IRelationFactory.d.ts" />
import './HasOneOrMany';
export declare class RelationFactory implements NajsEloquent.Relation.IRelationFactory {
    protected rootModel: NajsEloquent.Model.IModel<any>;
    protected relation: NajsEloquent.Relation.IRelation;
    protected name: string;
    protected isSample: boolean;
    constructor(rootModel: NajsEloquent.Model.IModel<any>, name: string, isSample: boolean);
    hasOne(model: string | NajsEloquent.Model.ModelDefinition<any>, foreignKey?: string, localKey?: string): any;
    protected getModelByNameOrDefinition(model: string | Function): NajsEloquent.Model.IModel<any>;
}
