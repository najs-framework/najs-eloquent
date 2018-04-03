const util = require('util')

function a() {
  return 'query'
}
a._real = {
  something: 'test'
}

const relation = new Proxy(a, {
  get(target, key) {
    if (key === 'something') {
      return target['_real'][key]
    }
    return target[key]
  },
  set(target, key, value) {
    if (key === 'something') {
      target['_real'][key] = value
      return true
    }
    target[key] = value
    return true
  }
})

relation.something = 'new data'
console.log(relation.something)
console.log(relation())

console.log(util.isObject(a))

// const RelationProxy = {
//   get(target, key) {
//     if (key === 'data' && !this.loaded) {
//       console.log('ERROR: Relation is not loaded')
//       return 'undefined'
//     }
//     return target[key]
//   }
// }

// class Relation {
//   constructor() {
//     this.loaded = false
//     return new Proxy(this, RelationProxy)
//   }

//   query() {
//     console.log('query')
//     return this
//   }

//   then(handler) {
//     // console.log('then')
//     // create new instance of itself
//     // const result = new Relation()
//     this.loaded = true
//     this.load().then(handler)
//   }

//   load() {
//     return new Promise(resolve => {
//       resolve(new LinkedModel('result'))
//     })
//   }
// }

// class LinkedModel {
//   constructor(data) {
//     this.data = data
//     this.relation = new Relation()
//   }
// }

// class Model {
//   constructor(data) {
//     this.data = data
//     this.relation = new Relation()
//   }
// }

// async function test() {
//   // const relation = new Relation(false)
//   // console.log(relation)
//   // console.log(await relation)

//   const model = new Model()
//   console.log('relation 1', model.relation)
//   console.log('relation 2', await model.relation)

//   console.log('data 1', model.relation.data)
//   console.log('data 2', await model.relation.data)
//   console.log('data 3', (await model.relation).data)
//   console.log('data 4', model.relation.data)
// }

// test()
