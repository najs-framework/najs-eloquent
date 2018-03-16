export function init_mongoose(mongoose: any, name: string): Promise<any> {
  return new Promise(resolve => {
    mongoose.connect('mongodb://localhost/najs_eloquent_test_' + name)
    mongoose.Promise = global.Promise
    mongoose.connection.once('open', () => {
      resolve(true)
    })
  })
}

export function delete_collection(mongoose: any, collection: string): Promise<any> {
  return new Promise(resolve => {
    try {
      if (mongoose.connection.collection(collection)) {
        mongoose.connection.collection(collection).drop(function() {
          resolve(true)
        })
      } else {
        resolve(true)
      }
    } catch (error) {}
  })
}
