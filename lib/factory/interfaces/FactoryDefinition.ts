/// <reference types="chance" />

namespace NajsEloquent.Factory {
  export interface FactoryDefinition {
    (faker: Chance.Chance, attributes?: Object): Object
  }
}
