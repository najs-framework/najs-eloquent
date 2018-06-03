/// <reference types="node" />

namespace NajsEloquent.Model {
  export declare class IModelEvent {
    protected eventEmitter?: NodeJS.EventEmitter
  }

  export interface IModelEvent extends NodeJS.EventEmitter {
    /**
     * Trigger the event with both global and local EventEmitter.
     *
     * Listener in local EventEmitter triggered with the same args, in Global EventEmitter automatically add the model
     * instance as the first argument. For example:
     *
     *    model.fire('test', [1, 2])
     *
     * then:
     *
     *    local_listener(a, b)         // a=1, b=2
     *    global_listener(model, a, b) // model: model triggered, a=1, b=2
     *
     * @param {string} eventName event's name
     * @param {array} args arguments
     */
    fire(eventName: string, args: any[]): this
  }
}
