/// <reference path="../IModel.d.ts" />
/// <reference path="../IModelQuery.d.ts" />
/// <reference path="../../../wrappers/interfaces/IQueryBuilderWrapper.d.ts" />
declare namespace NajsEloquent.Model.Static {
    interface IMongooseStatic<T, R extends NajsEloquent.Wrapper.IQueryBuilderWrapper<any>> extends IModelQuery<T, R> {
        new (data?: Object): IModel<T> & IModelQuery<T, R>;
        Class<ChildType>(): IMongooseStatic<ChildType & T, R>;
    }
}
