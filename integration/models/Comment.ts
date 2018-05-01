import { EloquentMongoose } from '../../dist/lib'

export interface IComment {
  user_id?: string
  email?: string
  name?: string
  content: string
  like: number
}

export interface Comment extends IComment {}
export class Comment extends EloquentMongoose<IComment> {
  static className: string = 'Comment'
  protected static timestamps = true
  protected static softDeletes = true
  protected static schema = {
    user_id: { type: String, required: false },
    email: { type: String, required: false },
    name: { type: String, required: false },
    content: { type: String, required: true },
    like: { type: Number, required: false }
  }

  getClassName() {
    return Comment.className
  }
}
