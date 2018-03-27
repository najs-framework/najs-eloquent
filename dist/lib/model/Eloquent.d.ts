import { Base } from './spec/Base'
import { Query } from './spec/Query'
import { EloquentModel } from './spec/EloquentModel'
import { MongooseMembers } from './spec/MongooseMembers'
import { MongooseDefinition } from './spec/MongooseDefinition'

declare interface Model<Attributes, Extension> {
  new (): EloquentModel<Attributes> & Attributes & Extension
  new (data: Object): EloquentModel<Attributes> & Attributes & Extension
  new (data: Attributes): EloquentModel<Attributes> & Attributes & Extension

  Mongoose<Attribute, Class>(): MongooseDefinition<Attribute, Class>

  register(model: Function | typeof Eloquent): void
}

export declare type EloquentMongoose<A, C> = MongooseDefinition<A, C>

export declare interface Mongoose<T extends Object> extends Model<T, MongooseMembers> {}

export declare const Eloquent: Model<{}, {}>
