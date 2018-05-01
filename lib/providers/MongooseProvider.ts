/// <reference path="../contracts/MongooseProvider.ts" />

import { Facade } from 'najs-facade'
import { register } from 'najs-binding'
import { NajsEloquent } from './../constants'
import { Mongoose, Model, Schema, Document, model } from 'mongoose'
const mongoose = require('mongoose')

export class MongooseProvider extends Facade
  implements Najs.Contracts.Eloquent.MongooseProvider<Mongoose, Schema, Model<Document>> {
  static className: string = NajsEloquent.Provider.MongooseProvider
  getClassName() {
    return NajsEloquent.Provider.MongooseProvider
  }

  getMongooseInstance(): Mongoose {
    return mongoose
  }

  createModelFromSchema<T extends Document>(modelName: string, schema: Schema): Model<T> {
    return model<T>(modelName, schema)
  }
}
register(MongooseProvider)
