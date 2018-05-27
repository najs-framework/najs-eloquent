/// <reference path="../model/interfaces/IModel.d.ts" />
/// <reference path="../factory/interfaces/FactoryDefinition.d.ts" />
declare namespace Najs.Contracts.Eloquent {
    interface FactoryManager {
        define(className: string | NajsEloquent.Model.ModelDefinition<any>, definition: NajsEloquent.Factory.FactoryDefinition, name: string): this;
        defineAs(className: string | NajsEloquent.Model.ModelDefinition<any>, name: string, definition: NajsEloquent.Factory.FactoryDefinition): this;
        state(className: string | NajsEloquent.Model.ModelDefinition<any>, state: string, definition: NajsEloquent.Factory.FactoryDefinition): this;
        of<T>(className: string | NajsEloquent.Model.ModelDefinition<T>): FactoryBuilder<T>;
        of<T>(className: string | NajsEloquent.Model.ModelDefinition<T>, name: string): FactoryBuilder<T>;
        create<T>(className: string | NajsEloquent.Model.ModelDefinition<T>): T;
        create<T>(className: string | NajsEloquent.Model.ModelDefinition<T>, attributes: Object): T;
        createAs<T>(className: string | NajsEloquent.Model.ModelDefinition<T>, name: string): T;
        createAs<T>(className: string | NajsEloquent.Model.ModelDefinition<T>, name: string, attributes: Object): T;
        make<T>(className: string | NajsEloquent.Model.ModelDefinition<T>): T;
        make<T>(className: string | NajsEloquent.Model.ModelDefinition<T>, attributes: Object): T;
        makeAs<T>(className: string | NajsEloquent.Model.ModelDefinition<T>, name: string): T;
        makeAs<T>(className: string | NajsEloquent.Model.ModelDefinition<T>, name: string, attributes: Object): T;
        raw<T>(className: string | NajsEloquent.Model.ModelDefinition<T>): T;
        raw<T>(className: string | NajsEloquent.Model.ModelDefinition<T>, attributes: Object): T;
        rawOf<T>(className: string | NajsEloquent.Model.ModelDefinition<T>, name: string): T;
        rawOf<T>(className: string | NajsEloquent.Model.ModelDefinition<T>, name: string, attributes: Object): T;
    }
}
