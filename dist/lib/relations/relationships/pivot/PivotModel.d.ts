/// <reference path="../../../definitions/relations/IPivotOptions.d.ts" />
import IPivotOptions = NajsEloquent.Relation.IPivotOptions;
import { Model } from '../../../model/Model';
export declare class PivotModel extends Model {
    /**
     * Make new Pivot Model type
     *
     * @param modelName
     */
    static createPivotClass(modelName: string, options: IPivotOptions, className?: string): typeof PivotModel;
}
