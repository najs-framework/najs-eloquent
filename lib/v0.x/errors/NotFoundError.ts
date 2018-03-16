const MESSAGE = ':model is not found.'

export class NotFoundError extends Error {
  static className: string = 'NotFoundError'

  model: string

  constructor(model: string) {
    super(MESSAGE.replace(':model', model))
    Error.captureStackTrace(this, NotFoundError)
    this.name = NotFoundError.className
    this.model = model
  }
}
