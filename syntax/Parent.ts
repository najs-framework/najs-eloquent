import { Schema } from 'mongoose'
import { Eloquent } from '../lib/index'
import { EloquentMongooseSpec } from '../lib/specs/EloquentMongooseSpec'

// Definition
export interface IParentVirtualAttribute {
  parent_virtual_attribute: Date
}

// Please note that base class is
//      Eloquent.Mongoose<IParentVirtualAttribute, Parent>()
// IParentVirtualAttribute: virtual attributes which often shared to client side
// Parent: we have to pass class name, otherwise instance and eloquent will get Type error in build time
export const BaseClass: EloquentMongooseSpec<IParentVirtualAttribute, Parent> = Eloquent.Mongoose<
  IParentVirtualAttribute,
  Parent
>()
export class Parent extends BaseClass {
  static className: string = 'Parent'

  getClassName() {
    return Parent.className
  }

  getSchema(): Schema {
    return new Schema({})
  }

  get parent_getter(): string {
    return 'parent_getter'
  }

  set parent_setter(value: string) {}

  parentMethod() {}

  static parentStaticMethod() {}
}

export function test_syntax() {
  // Usage
  const instance = new Parent()
  instance.parentMethod()
  const value: string = instance.parent_getter
  instance.parent_setter = 'value'
  instance.parent_virtual_attribute = new Date()
  use(value)

  Parent.parentStaticMethod()

  async function test_collection() {
    const value = await Parent.select().all()
    value.map(item => item.parent_virtual_attribute).toArray()
  }
  use(test_collection)

  async function test_eloquent() {
    const eloquent = (await Parent.select().all()).first()
    const value = eloquent.parent_getter
    eloquent.parent_setter = 'value'
    const date = eloquent.parent_virtual_attribute
    eloquent.save()
    use(value)
    use(date)
  }
  use(test_eloquent)

  function use(...any: Array<any>) {}
}
