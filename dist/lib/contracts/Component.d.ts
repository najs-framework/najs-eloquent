declare namespace Najs.Contracts.Eloquent {
    interface Component extends Najs.Contracts.Autoload {
        /**
         * Extend a prototype of current model class
         *
         * @param {Object} prototype model class prototype
         * @param {Object[]} bases Eloquent and Model prototype
         * @param {Najs.Contracts.Eloquent.Driver} driver Driver which attached to the model
         */
        extend(prototype: Object, bases: Object[], driver: Najs.Contracts.Eloquent.Driver<any>): void;
    }
}
