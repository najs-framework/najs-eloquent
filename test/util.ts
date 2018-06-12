import { MongodbProviderFacade } from '../lib/facades/global/MongodbProviderFacade'

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
    mongoose.connection.collection(collection).drop(resolve)
  })
}

export function init_mongodb(name: string): any {
  return MongodbProviderFacade.connect('mongodb://localhost:27017/najs_eloquent_test_' + name)
}

export function delete_collection_use_mongodb(name: string): any {
  return MongodbProviderFacade.getDatabase()
    .collection(name)
    .drop()
}
