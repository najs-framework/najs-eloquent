import { Facade } from 'najs-facade'
import { register } from 'najs-binding'
import { NajsEloquentClass } from './../constants'
import { IMongooseProvider } from './interfaces/IMongooseProvider'
import { Mongoose, Model, Schema, Document, model } from 'mongoose'
const mongoose = require('mongoose')

export class BuiltinMongooseProvider extends Facade implements IMongooseProvider {
  static className: string = NajsEloquentClass.MongooseProvider
  getClassName() {
    return NajsEloquentClass.MongooseProvider
  }

  getMongooseInstance(): Mongoose {
    return mongoose
  }

  createModelFromSchema<T extends Document>(modelName: string, schema: Schema): Model<T> {
    return model<T>(modelName, schema)
  }
}
register(BuiltinMongooseProvider)
