/// <reference path="../../../definitions/relations/IPivotOptions.ts" />
import IPivotOptions = NajsEloquent.Relation.IPivotOptions
import { register, ClassRegistry } from 'najs-binding'
import { Model } from '../../../model/Model'
import { PrototypeManager } from '../../../util/PrototypeManager'

export class PivotModel extends Model {
  /**
   * Make new Pivot Model type
   *
   * @param modelName
   */
  static createPivotClass(modelName: string, options: IPivotOptions, className?: string): typeof PivotModel {
    if (typeof className === 'undefined') {
      className = `NajsEloquent.Pivot.${modelName}`
    }

    if (ClassRegistry.has(className)) {
      return ClassRegistry.findOrFail(className).instanceConstructor! as typeof PivotModel
    }

    class Pivot extends PivotModel {
      protected options: IPivotOptions = options

      getClassName() {
        return className
      }

      getModelName() {
        return modelName
      }
    }
    register(Pivot, className)

    return Pivot
  }
}
PrototypeManager.stopFindingRelationsIn(PivotModel)
