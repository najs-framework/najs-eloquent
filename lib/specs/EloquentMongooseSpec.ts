import { EloquentMongoose } from '../eloquent/EloquentMongoose'
import { MongooseQueryBuilder } from '../query-builders/MongooseQueryBuilder'

export type EloquentMongooseSpec<Attr, Class> = {
  new (): EloquentMongoose<Attr> & Attr

  Class<ChildAttr, ChildClass>(): EloquentMongooseSpec<Class & ChildAttr, Class & ChildClass>

  select(): MongooseQueryBuilder<EloquentMongoose<Attr> & Attr & Class>
}
