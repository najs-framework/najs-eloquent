/// <reference types="node" />
declare namespace NajsEloquent.Model {
    class IModelEvent {
        protected eventEmitter: NodeJS.EventEmitter;
    }
    interface IModelEvent extends NodeJS.EventEmitter {
    }
}
