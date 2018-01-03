export interface IQueryFetchResult<EloquentModel> {
  all(): Promise<Array<EloquentModel>>

  get(): Promise<Array<EloquentModel>>

  find(): Promise<EloquentModel>

  pluck(): Promise<Object>

  update(): Promise<any>
  delete(): Promise<any>
}
