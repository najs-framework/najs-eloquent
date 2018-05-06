/// <reference path="../interfaces/IHasOne.ts" />

export type HasOne<T> = NajsEloquent.Relation.IHasOne<T>

// import { Eloquent } from '../../model/Eloquent'

// export interface IPost {
//   title: string
// }

// export interface IUser {
//   first_name: string
// }

// export interface User extends IUser {}

// export class User extends Eloquent<IUser> {
//   get post() {
//     return this.hasOne<IPost>()
//   }

//   hasOne<T>(): HasOne<T> {
//     return <any>{}
//   }
// }

// const user = new User()
// user.post.load()
