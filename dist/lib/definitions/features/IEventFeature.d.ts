/// <reference path="IFeature.d.ts" />
/// <reference path="../model/IModel.d.ts" />
declare namespace NajsEloquent.Feature {
    interface IEventFeature extends IFeature {
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
         * @param {Model} model
         * @param {string} eventName event's name
         * @param {mixed} args arguments
         */
        fire(model: Model.IModel, eventName: string, args: any): Promise<void>;
        /**
         * Get event emitter instance which is created for the model only.
         *
         * @param {Model} model
         */
        getEventEmitter(model: Model.IModel): Najs.Contracts.Event.AsyncEventEmitter;
        /**
         * Get global event emitter shared by the driver.
         *
         * @param {Model} model
         */
        getGlobalEventEmitter(model: Model.IModel): Najs.Contracts.Event.AsyncEventEmitter;
    }
}
