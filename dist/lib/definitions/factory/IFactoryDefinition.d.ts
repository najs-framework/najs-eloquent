/// <reference types="chance" />
declare namespace NajsEloquent.Factory {
    interface IFactoryDefinition {
        (faker: Chance.Chance, attributes?: object): object;
    }
}
