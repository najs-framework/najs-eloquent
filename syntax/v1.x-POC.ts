import { Collection } from 'collect.js'

export type EloquentSpec<T> = {
  new (): any

  first(): Promise<T>

  get(): Promise<Collection<T>>
}

export class EloquentDriver {}

export class Mongoose<T extends any = {}> extends EloquentDriver {
  async findById(): Promise<T> {
    return <any>{}
  }

  async get(): Promise<Collection<T>> {
    return <any>{}
  }
}

export function Eloquent<T>(driver: EloquentDriver): EloquentSpec<T> {
  return <any>{}
}

interface IModel {
  member: string
}

class Model extends Eloquent<Model>(Mongoose) implements IModel {
  member: string

  memberMethod() {}
}

async function demo() {
  const instance = new Model()
  instance.member = 'test'

  const firstResult = await Model.first()
  firstResult.member = 'test'
}
console.log(demo)

// export interface MongooseSpec<T> {
//   new (): T
// }

// export class Eloquent<Doc> {
//   async findById(id: string): Promise<this & Doc> {
//     return <any>{}
//   }

//   static where(): typeof Mongoose {
//     return <any>this
//   }

//   static get<T>(): Collection<Mongoose<T>> {
//     return <any>this
//   }

//   static first<T>(): Eloquent<T> {
//     return <any>{}
//   }

//   static Mongoose<T>(): MongooseSpec<T> {
//     return <any>{}
//   }

//   static Class: MongooseSpec<any>
// }

// export class Mongoose<T extends any = {}> extends Eloquent<T> implements MongooseSpec<T> {}

// interface IParent {
//   parent_attribute: string
//   parent_getter: string
//   parent_setter: string
// }

// class A extends (Mongoose<T>)Eloquent.Mongoose {}

// class Parent extends Mongoose<IParent> implements IParent {
//   parent_attribute: string

//   get parent_getter(): string {
//     return 'parent_getter'
//   }

//   set parent_setter(value: string) {}

//   static async findByName(): Promise<IParent> {
//     return <any>{}
//   }

//   test() {}
// }

// async function demo() {
//   Parent.findByName()
//   const parentInstance = new Parent()
//   parentInstance.parent_attribute = 'test'

//   const result = await parentInstance.findById('test')
//   result.parent_attribute = 'test'

//   const model: Eloquent<IParent> = await Parent.first<IParent>()

//   // collection.tes
// }
