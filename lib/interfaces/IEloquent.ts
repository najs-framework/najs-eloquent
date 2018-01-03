export interface IEloquent {
  __knownAttributeList: Array<string>
  attributes: Object
  fillable: Array<string>

  fill(attributes: Object): this

  setAttribute(attribute: string, value: any): this

  getAttribute(attribute: string): any

  toJson(): Object

  save(): Promise<any>
  create(): Promise<any>
  update(): Promise<any>
  delete(): Promise<any>
}
