/// <reference path="../definitions/model/IModel.d.ts" />
/// <reference path="../definitions/relations/IRelationship.d.ts" />
import IModel = NajsEloquent.Model.IModel;
import RelationDefinition = NajsEloquent.Relation.RelationDefinition;
export declare class RelationDefinitionFinder {
    model: IModel;
    prototype: object;
    bases: object[];
    constructor(model: IModel, prototype: object, bases: object[]);
    getDefinitions(): {};
    findDefinitionsInPrototype(prototype: object): {};
    findDefinition(target: string, descriptor: PropertyDescriptor, className?: string): RelationDefinition | undefined;
    warning(definition: RelationDefinition, definedDefinition: RelationDefinition): void;
    formatTargetName(definition: RelationDefinition): string;
}
