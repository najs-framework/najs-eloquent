export const RelationProxy = {
  get(target: any, key: any): any {
    if (!target.loaded) {
      // show warning that the Relation is not loaded
    }
  }
}
