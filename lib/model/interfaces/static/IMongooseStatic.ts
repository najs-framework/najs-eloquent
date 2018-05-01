/// <reference path="../IModel.ts" />
/// <reference path="../IModelQuery.ts" />
/// <reference path="../../../wrappers/interfaces/IQueryBuilderWrapper.ts" />

namespace NajsEloquent.Model.Static {
  export interface IMongooseStatic<T, R extends NajsEloquent.Wrapper.IQueryBuilderWrapper<any>>
    extends IModelQuery<T, R> {
    new (data?: Object): IModel<T> & IModelQuery<T, R>

    Class<ChildType>(): IMongooseStatic<ChildType & T, R>
  }
}
