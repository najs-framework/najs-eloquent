/// <reference types="node" />
// class Comment {
//   post?: Post
//   postRelationship(): any {
//     // return belongsTo('Post')
//   }
// }
// type Relation = {
//   getRelationship(): any
// }
// class Post {
//   comments: (Comment[] | undefined) & Relation = this.hasMany('Comment')
//   commentsRelationship(): any {
//     // return hasMany('Comment')
//   }
//   hasMany(table: string): any {}
//   relationship(relation: any): any {}
// }
// async function relation_test() {
//   const post = new Post()
//   if (!post.comments) {
//     await post
//       .commentsRelationship()
//       .where('title', 'like', '%Test%')
//       .get()
//   }
//   await post.comments
//     .getRelationship()
//     .where('title')
//     .get()
//   post.relationship(post.comments)
// }
// type Proxy<T> = {
//   get(): T
//   set(value: T): void
// }
// type Proxify<T> = { [P in keyof T]: T[P] }
// function proxify<T>(o: T): Proxify<T> {
//   return <any>{}
// }
// const props = {
//   email: 'test'
// }
// let proxyProps = proxify(props)
// proxyProps.email
// type RelationType = (() => string) & { data: string }
// const x: RelationType = <any>{}
// function a() {}
// a['_real'] = {
//   something: 'test'
// }
// type Proxify<T> = { [P in keyof T]: T[P] }
// function hasOne<T>(model: any): Proxify<T> | Function {
//   return <any>{}
// }
// interface IPost {
//   id?: string
//   title: string
// }
// const postRelation = hasOne<IPost>('Post')
// type PostType = {
//   title: string
// }
// type PostPick = Pick<IPost, 'title'>
// type FUNC = Pick<Function, 'call'>
// const x: FUNC = function test() {}
// type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T]
// type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>
// interface IUser {
//   email: string
//   password: string
// }
// interface Relation {
//   (): string
//   name?: never
//   /**
//    * Calls the function, substituting the specified object for the this value of the function, and the specified array for the arguments of the function.
//    * @param thisArg The object to be used as the this object.
//    * @param argArray A set of arguments to be passed to the function.
//    */
//   apply(this: Function, thisArg: any, argArray?: any): never
//   /**
//    * Calls a method of an object, substituting another object for the current object.
//    * @param thisArg The object to be used as the current object.
//    * @param argArray A list of arguments to be passed to the method.
//    */
//   call(this: Function, thisArg: any, ...argArray: any[]): never
//   /**
//    * For a given function, creates a bound function that has the same body as the original function.
//    * The this object of the bound function is associated with the specified object, and has the specified initial parameters.
//    * @param thisArg An object to which the this keyword can refer inside the new function.
//    * @param argArray A list of arguments to be passed to the new function.
//    */
//   bind(this: Function, thisArg: any, ...argArray: any[]): never
//   /** Returns a string representation of a function. */
//   toString(): never
//   prototype: never
//   readonly length: never
//   // Non-standard extensions
//   arguments: never
//   caller: never
//   test: string
// }
// interface IPost {
//   name: string
// }
// const a: Relation & IPost = <any>{}
// type Fn = Relation
// type TCleanedUser = Omit<Relation, 'test'>
// const z: Fn = <any>{}
// const y: TCleanedUser = <Relation>z
// const relation = new Proxy(a, {
//   get(target, key) {
//     if (key === 'something') {
//       return target['_real'][key]
//     }
//     return target[key]
//   },
//   set(target, key, value) {
//     if (key === 'something') {
//       target['_real'][key] = value
//       return true
//     }
//     target[key] = value
//     return true
//   }
// })
// relation.something = 'new data'
// console.log(relation.something)
// console.log(relation())
// console.log(util.isObject(a))
