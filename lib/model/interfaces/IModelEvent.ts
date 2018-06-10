/// <reference types="najs-event" />

namespace NajsEloquent.Model {
  export declare class IModelEvent {
    protected eventEmitter?: Najs.Contracts.Event.AsyncEventEmitter
  }

  export interface IModelEvent extends Najs.Contracts.Event.AsyncEventEmitter {
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
     *    local_listener(data)         // data = [1, 2]
     *    global_listener(model, data) // model triggered, data = [1, 2]
     *
     * @param {string} eventName event's name
     * @param {mixed} args arguments
     */
    fire(eventName: string, args: any): Promise<void>
  }
}
