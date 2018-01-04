import { EloquentMongoose } from '../eloquent/EloquentMongoose'
import { MongooseQueryBuilder } from '../query-builders/MongooseQueryBuilder'

export type EloquentMongooseSpec<T, R> = {
  new (): EloquentMongoose<T> & T
  Base: EloquentMongooseSpec<T, R>
  Class<Child>(): EloquentMongooseSpec<T, R & Child>
  select(): MongooseQueryBuilder<EloquentMongoose<T> & T & R>
}
