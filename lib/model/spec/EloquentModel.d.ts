import { Base } from './Base'
import { Query } from './Query'

export declare interface EloquentModel<T> extends Base<T>, Query<T> {}
