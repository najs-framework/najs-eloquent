export interface BasicQuery {
  where(): this
}

export interface FetchResult<T> {
  first(): this & T
}

export interface Model<Props> extends BasicQuery, FetchResult<Props> {
  id: string

  getId(): string
}

export type MongooseStatic<T, C> = {
  new (): Model<T> & T

  where(): BasicQuery & FetchResult<Model<T> & T & C>

  first(): Model<T> & T & C
}

export type IEloquent<T> = {
  new (): Model<T> & T

  Mongoose<T, C>(): MongooseStatic<T, C>
}

export declare const Eloquent: IEloquent<{}>

export declare interface Mongoose<T> extends IEloquent<T> {}

// 1st way -------------------------------------------------------------------------------------------------------------
export interface IUser {
  first_name: string
  last_name: string
}

export class UserOne extends Eloquent implements IUser {
  first_name: string
  last_name: string

  doSomething(...args: any[]) {}

  static doesSomething(...args: any[]) {}
}

const userOneModel = new UserOne()
const resultOne = userOneModel.where().first()
const firstNameOne: string = resultOne.first_name
resultOne.last_name = 'first way assignment'
resultOne.doSomething(firstNameOne)
UserOne.doesSomething(firstNameOne)
UserOne.doesSomething(userOneModel.first())
userOneModel.first().first_name = 'test'

// 2nd way -------------------------------------------------------------------------------------------------------------
export class UserTwo extends Eloquent.Mongoose<IUser, UserTwo>() {
  doSomething(...args: any[]) {}

  static doesSomething(...args: any[]) {}
}

const resultTwo = UserTwo.where().first()
const firstNameTwo: string = resultTwo.first_name
resultTwo.last_name = 'third way assignment'
resultTwo.doSomething(firstNameTwo)
UserTwo.doesSomething(firstNameOne)
UserTwo.doesSomething(UserTwo.first())
UserTwo.first().first_name = 'test'

const userTwoModel = new UserTwo()
const resultTwo_Instance = userTwoModel.where().first()
const firstNameTwo_Instance: string = resultTwo_Instance.first_name
resultTwo_Instance.last_name = 'third way assignment'
resultTwo_Instance.doSomething(firstNameTwo_Instance)

// 3rd way -------------------------------------------------------------------------------------------------------------
export class UserThree extends (Eloquent as Mongoose<IUser>) {
  doSomething(...args: any[]) {}

  static doesSomething(...args: any[]) {}
}

const userThreeModel = new UserThree()
const resultThree = userThreeModel.where().first()
const firstNameThree: string = resultThree.first_name
resultThree.last_name = 'third way assignment'
resultThree.doSomething(firstNameThree)
UserThree.doesSomething(firstNameOne)
UserThree.doesSomething(userThreeModel.first())
userThreeModel.first().first_name = 'test'
