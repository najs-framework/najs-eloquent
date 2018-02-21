import { register } from 'najs-binding'
import { IMongooseProvider } from '../lib'
import { Schema, Document, Model, model } from 'mongoose'
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

  createModelFromSchema<T extends Document>(modelName: string, schema: Schema): Model<T> {
    return model<T>(modelName, schema)
  }
}
