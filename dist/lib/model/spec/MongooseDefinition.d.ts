import { Mongoose } from '../Eloquent'
import { MongooseStaticQuery } from './MongooseStaticQuery'

export declare interface MongooseDefinition<Attr, Class> extends MongooseStaticQuery<Attr & Class> {
  new (): Eloquent<Attr> & Attr
  new (data: Object): Eloquent<Attr> & Attr

  Class<ChildAttr, ChildClass>(): MongooseDefinition<Class & ChildAttr, Class & ChildClass>
}
