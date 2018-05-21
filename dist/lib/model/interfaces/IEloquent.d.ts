/// <reference path="IModel.d.ts" />
/// <reference path="IModelQuery.d.ts" />
/// <reference path="../../wrappers/interfaces/IQueryBuilderWrapper.d.ts" />
declare namespace NajsEloquent.Model {
    interface IEloquent<T> extends IModel<T>, IModelQuery<T, Wrapper.IQueryBuilderWrapper<T>> {
    }
}
