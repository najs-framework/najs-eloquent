/// <reference path="IModel.ts" />
/// <reference path="IModelQuery.ts" />
/// <reference path="../../wrappers/interfaces/IQueryBuilderWrapper.ts" />

namespace NajsEloquent.Model {
  export interface IEloquent<T> extends IModel<T>, IModelQuery<T, Wrapper.IQueryBuilderWrapper<T>> {}
}
