export interface ISoftDeletesQuery {
  withTrashed(): this

  onlyTrashed(): this
}
