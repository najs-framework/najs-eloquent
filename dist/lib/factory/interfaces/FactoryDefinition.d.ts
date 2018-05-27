/// <reference types="chance" />
declare namespace NajsEloquent.Factory {
    interface FactoryDefinition {
        (faker: Chance.Chance, attributes?: Object): Object;
    }
}
