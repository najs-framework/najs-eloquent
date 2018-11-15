/// <reference types="chance" />

namespace NajsEloquent.Factory {
  export interface IFactoryDefinition {
    (faker: Chance.Chance, attributes?: object): object
  }
}
