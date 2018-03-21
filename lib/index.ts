// Currently v0.x is published they will be deleted completely when v1.x is done

import { EloquentMongoose } from './v0.x/eloquent/EloquentMongoose'
import { EloquentMongooseSpec } from './v0.x/specs/EloquentMongooseSpec'

export const Mongoose = EloquentMongoose

export const Eloquent = {
  Mongoose<T, R>(): EloquentMongooseSpec<T, R> {
    return <any>EloquentMongoose
  }
}
export default Eloquent
export { QueryLog } from './log/QueryLog'

export { EloquentBase } from './v0.x/eloquent/EloquentBase'
export { EloquentMetadata, EloquentTimestamps, EloquentSoftDelete } from './v0.x/eloquent/EloquentMetadata'

export { IMongooseProvider } from './v0.x/interfaces/IMongooseProvider'
export { IBasicQueryConditionGrammar, IBasicQueryGrammar } from './v0.x/interfaces/IBasicQueryGrammar'
export { IEloquent } from './v0.x/interfaces/IEloquent'
export { IQueryFetchResult } from './v0.x/interfaces/IQueryFetchResult'

export { EloquentMongooseSpec } from './v0.x/specs/EloquentMongooseSpec'
