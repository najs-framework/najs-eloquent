import { EloquentMongoose } from '../drivers/EloquentMongoose'

export type EloquentMongooseSpec<T> = {
  new (): EloquentMongoose & T
}
