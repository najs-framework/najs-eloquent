import { register } from 'najs'
import { IMongooseProvider } from '../lib'
const mongoose = require('mongoose')

@register() // register MongooseProvider with 'MongooseProvider' name
export class MongooseProvider implements IMongooseProvider {
  static className: string = 'MongooseProvider'

  getClassName() {
    return MongooseProvider.className
  }

  getMongooseInstance() {
    return mongoose
  }
}
