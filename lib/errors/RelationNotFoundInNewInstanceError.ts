const MESSAGE = 'Cannot load relation :name in a new instance of :model.'

export class RelationNotFoundInNewInstanceError extends Error {
  static className: string = 'RelationNotFoundInNewInstanceError'

  relationName: string
  model: string

  constructor(name: string, model: string) {
    super(MESSAGE.replace(':name', name).replace(':model', model))
    Error.captureStackTrace(this, RelationNotFoundInNewInstanceError)
    this.name = RelationNotFoundInNewInstanceError.className
    this.relationName = name
    this.model = model
  }
}
