import { Collection } from 'collect.js'
export declare class Model<T = any> {
  method(): void

  first(): this
}
export declare type Mongoose<T> = {
  Mongoose<U>(): Mongoose<U> & WithStatic<U>
}

export declare type WithStatic<T> = {
  new (): Model<T> & T

  first(): Model<T> & T

  get(): Collection<Model<T> & T>
}

export const Eloquent: Mongoose<any> & WithStatic<any>
export declare const EloquentMongoose: Mongoose<any> & WithStatic<any>
export declare class EloquentMongoose extends Model {}
