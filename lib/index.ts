import { EloquentMongoose } from './drivers/EloquentMongoose'
import { EloquentMongooseSpec } from './specs/EloquentMongooseSpec'

export const Eloquent = {
  Mongoose<T>(): EloquentMongooseSpec<T> {
    return <any>EloquentMongoose
  }
}
export default Eloquent
