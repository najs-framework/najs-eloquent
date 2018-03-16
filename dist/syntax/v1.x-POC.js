"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EloquentDriver {
}
exports.EloquentDriver = EloquentDriver;
class Mongoose extends EloquentDriver {
    async findById() {
        return {};
    }
    async get() {
        return {};
    }
}
exports.Mongoose = Mongoose;
function Eloquent(driver) {
    return {};
}
exports.Eloquent = Eloquent;
class Model extends Eloquent(Mongoose) {
    memberMethod() { }
}
async function demo() {
    const instance = new Model();
    instance.member = 'test';
    const firstResult = await Model.first();
    firstResult.member = 'test';
}
console.log(demo);
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
