"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const najs_binding_1 = require("najs-binding");
const Model_1 = require("../../../model/Model");
const PrototypeManager_1 = require("../../../util/PrototypeManager");
class PivotModel extends Model_1.Model {
    /**
     * Make new Pivot Model type
     *
     * @param modelName
     */
    static createPivotClass(modelName, options, className) {
        if (typeof className === 'undefined') {
            className = `NajsEloquent.Pivot.${modelName}`;
        }
        if (najs_binding_1.ClassRegistry.has(className)) {
            return najs_binding_1.ClassRegistry.findOrFail(className).instanceConstructor;
        }
        class Pivot extends PivotModel {
            constructor() {
                super(...arguments);
                this.options = options;
            }
            getClassName() {
                return className;
            }
            getModelName() {
                return modelName;
            }
        }
        najs_binding_1.register(Pivot, className);
        return Pivot;
    }
}
exports.PivotModel = PivotModel;
PrototypeManager_1.PrototypeManager.stopFindingRelationsIn(PivotModel);
