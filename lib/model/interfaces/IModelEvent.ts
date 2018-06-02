/// <reference types="node" />

namespace NajsEloquent.Model {
  export declare class IModelEvent {
    protected eventEmitter: NodeJS.EventEmitter
  }

  export interface IModelEvent extends NodeJS.EventEmitter {}
}
