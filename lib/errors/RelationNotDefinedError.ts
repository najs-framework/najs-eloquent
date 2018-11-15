const MESSAGE = 'Relation :name is not defined in model :model.'

export class RelationNotDefinedError extends Error {
  static className: string = 'NotFoundError'

  relationName: string
  model: string

  constructor(name: string, model: string) {
    super(MESSAGE.replace(':name', name).replace(':model', model))
    Error.captureStackTrace(this, RelationNotDefinedError)
    this.name = RelationNotDefinedError.className
    this.relationName = name
    this.model = model
  }
}
