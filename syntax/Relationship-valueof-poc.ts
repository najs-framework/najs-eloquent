class HasManyRelationship {
  value: any

  constructor(value?: any) {
    this.value = value
  }

  getValue() {
    return 'test'
  }
}

const SmartProxy = {
  get: function(target: any, key: any): any {
    console.log('get', key)
    if (target[key] instanceof HasManyRelationship) {
      if (!target['loaded'] || !target['loaded'][key]) {
        return undefined
      }
      return target[key]
    }

    return target[key]
  },

  set: function(target: any, key: any, value: any): any {
    console.log('set', arguments)
    target[key] = value
    return true
  }
}

interface IComment {
  test: string

  getValue(): any
}

class PostModel {
  comments: IComment = this.hasMany()
  loaded: Object = {}

  constructor() {
    return new Proxy(this, SmartProxy)
  }

  hasMany(): any {
    return new HasManyRelationship()
  }

  setLoaded(relationship: string) {
    this.loaded[relationship] = true
  }

  getComments(): any {
    this.loaded = true
  }
}

const notLoaded = new PostModel()
if (notLoaded.comments) {
  console.log('if (notLoaded.comments) returns true')
} else {
  console.log('if (notLoaded.comments) returns false')
}

const loaded = new PostModel()
loaded.setLoaded('comments')

if (loaded.comments) {
  console.log('if (loaded) returns true')
} else {
  console.log('if (loaded) returns false')
}

if (!loaded.comments) {
  loaded.comments = loaded.getComments()
}
loaded.comments && loaded.comments.getValue()

// console.log(loaded.comments.getValue())
// console.log(notLoaded.comments.getValue())
