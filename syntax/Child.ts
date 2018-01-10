import { Schema } from 'mongoose'
import { Collection } from 'collect.js'
import { Parent } from './Parent'
import { EloquentMongooseSpec } from '../lib'

// Definition
export interface IChildVirtualAttribute {
  child_virtual_attribute: Date
}

export const ChildBase: EloquentMongooseSpec<Parent & IChildVirtualAttribute, Parent & Child> = Parent.Class<
  IChildVirtualAttribute,
  Child
>()
export class Child extends ChildBase {
  static className: string = 'Child'

  getClassName() {
    return Child.className
  }

  getSchema(): Schema {
    return new Schema({})
  }

  get child_getter(): string {
    return 'child_getter'
  }

  set child_setter(value: string) {}

  childMethod() {}

  static childStaticMethod() {}
}

export function test_syntax() {
  // Usage
  const instance = new Child()
  const value = instance.child_getter
  instance.child_setter = 'value'
  const date = instance.child_virtual_attribute
  instance.childMethod()
  use(value)
  use(date)

  const value_parent = instance.parent_getter
  instance.parent_setter = 'value'
  const date_parent = instance.parent_virtual_attribute
  instance.parentMethod()
  use(value_parent)
  use(date_parent)

  instance.save()

  Child.childStaticMethod()
  Parent.parentStaticMethod()
  // Child.parentStaticMethod() => Access parent static method is not type-safe

  async function test_collection() {
    const value_child = await Child.select().all()
    value_child.map(item => item.child_virtual_attribute).toArray()

    const value_parent = await Child.select().all()
    value_parent
      .map<Date>(<any>function(item: Child) {
        return item.parent_virtual_attribute
      })
      .toArray()
  }
  use(test_collection)

  async function test_eloquent() {
    const eloquent = (await Child.select().all()).first()

    const value = eloquent.child_getter
    eloquent.child_setter = 'value'
    const date = eloquent.child_virtual_attribute
    eloquent.childMethod()
    use(value)
    use(date)

    const value_parent = eloquent.parent_getter
    eloquent.parent_setter = 'value'
    const date_parent = eloquent.parent_virtual_attribute
    eloquent.parentMethod()
    use(value_parent)
    use(date_parent)

    eloquent.save()

    const data: Collection<IChildVirtualAttribute> = await Child.where('test', 1).get()
    data.reduce(function() {}).all()

    const result: Child = await Child.find(1)
    result.parentMethod()
  }
  use(test_eloquent)

  function use(...any: Array<any>) {}
}
