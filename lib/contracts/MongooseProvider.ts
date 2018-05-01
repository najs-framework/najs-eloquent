namespace Najs.Contracts.Eloquent {
  export interface MongooseProvider<Mongoose = any, Schema = any, Model = any> extends Najs.Contracts.Autoload {
    /**
     * Get the mongoose singleton instance
     */
    getMongooseInstance(): Mongoose

    /**
     * Create a mongoose's model from mongoose's schema
     *
     * @param {string} modelName model name
     * @param {Schema} schema schema
     */
    createModelFromSchema(modelName: string, schema: Schema): Model
  }
}
