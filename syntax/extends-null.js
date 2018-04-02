// class Collection {
//   constructor(items) {
//     this.items = items
//   }

//   all() {
//     return items
//   }
// }

// const a = new Collection(['a'])
// a.isLoaded = function() {
//   return false
// }
// console.log(a)
// console.log(a.isLoaded())

// const b = new Collection(['b'])
// console.log(b.isLoaded())

const ModelProxy = {
  get(target, key) {
    console.log('ModelProxy', key)
    if (!target.key) {
      return 'not-found'
    }
    return target[key]
  }
}

class Model {
  constructor() {
    return new Proxy(this, ModelProxy)
  }
}

const ModelRelationProxy = {
  get(target, key) {
    console.log('ModelRelationProxy', key)
    return target[key]
  }
}

class ModelRelation {
  constructor(model) {
    this.model = model
    return new Proxy(this, ModelRelationProxy)
  }
}

const modelRelation = new ModelRelation(new Model())
const x = modelRelation.model.test

function MyNumberType(n) {
  this.number = n
}

MyNumberType.prototype.valueOf = function() {
  return null
}

const object1 = new MyNumberType(0)

if (object1 == null) {
  console.log(object1)
}
