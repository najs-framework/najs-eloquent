import { Collection } from 'collect.js'
import { MongooseQueryBuilder } from '../lib/query-builders/mongodb/MongooseQueryBuilder'
import { IBasicQuery } from '../lib/query-builders/interfaces/IBasicQuery'
import { IConditionQuery } from '../lib/query-builders/interfaces/IConditionQuery'
import { ISoftDeletesQuery } from '../lib/query-builders/interfaces/ISoftDeletesQuery'
import { IFetchResultQuery } from '../lib/query-builders/interfaces/IFetchResultQuery'

export declare interface Model<T = {}, E = {}> {
  new (): NajsEloquent.Eloquent<T> & T & E

  Mongoose<A, C>(): MongooseModel<A, C>

  register(): any
}

export declare interface Mongoose<T extends Object> extends Model<T, NajsEloquent.MongooseExtension> {}

export declare interface MongooseModel<Attr, Class> extends NajsEloquent.EloquentStatic<Class & Attr> {
  new (): NajsEloquent.Eloquent<Attr> & Attr & NajsEloquent.MongooseExtension

  Class<ChildAttr, ChildClass>(): MongooseModel<Class & ChildAttr, Class & ChildClass>
}

export const Eloquent: Model

namespace NajsEloquent {
  interface Query<Model> extends IBasicQuery, IConditionQuery, ISoftDeletesQuery, IFetchResultQuery<Model> {}

  interface EloquentModel {
    id: any

    protected fillable: string[]

    getFillable(): string[]
  }

  interface EloquentQuery<T> {
    select(): Query<this & T>

    where(field: string, value: string): Query<this & T>

    get(): this & T
  }

  interface Eloquent<T = {}> extends EloquentQuery<T>, EloquentModel {}

  interface EloquentStatic<T> {
    select(): Query<T>

    get(): Query<T>

    where(field: string, value: string): Query<T>
  }

  interface MongooseExtension {
    native()
  }
}

// import { Collection } from 'collect.js'
// export declare class Model<T = any> {
//   method(): void

//   first(): this
// }
// export declare type Mongoose<T> = {
//   Mongoose<U>(): Mongoose<U> & WithStatic<U>
// }

// export declare type WithStatic<T> = {
//   new (): Model<T> & T

//   first(): Model<T> & T

//   get(): Collection<Model<T> & T>
// }

// export const Eloquent: Mongoose<any> & WithStatic<any>
// export declare const EloquentMongoose: Mongoose<any> & WithStatic<any>
// export declare class EloquentMongoose extends Model {}

// export declare interface IEloquentTest {
//   new (): NajsEloquent.IEloquent

//   Mongoose<A, C>(): any

//   register(): any
// }
// export const EloquentTest: IEloquentTest

// // export class EloquentTest<T> implements NajsEloquent.IEloquent {}

// namespace NajsEloquent {
//   class EloquentProperties {
//     /**
//      * Something awesome
//      */
//     protected test: string
//   }

//   class IEloquent extends EloquentProperties {
//     /**
//      * Get the model's primary key
//      */
//     getId(): any

//     /**
//      * Set the model's primary key
//      * @param {Object} id
//      */
//     setId(id: value): void
//   }
// }
