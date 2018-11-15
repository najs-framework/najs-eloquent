/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/model/IModelSerialization.ts" />
import Model = NajsEloquent.Model.ModelInternal

import { flatten } from 'lodash'

function parse_relationsToObject_arguments(args: ArrayLike<string | string[]>) {
  if (args.length === 0) {
    return { formatName: true, relations: undefined }
  }

  if (args.length === 1 && typeof args[0] === 'boolean') {
    return { formatName: args[0] as any, relations: undefined }
  }

  const startIndex = args.length > 0 && typeof args[0] === 'boolean' ? 1 : 0
  const rest: Array<string | string[]> = []
  for (let i = startIndex; i < args.length; i++) {
    rest.push(args[i])
  }

  const formatName: boolean = startIndex === 1 ? (args[0] as any) : true
  return {
    formatName: formatName,
    relations: flatten(rest)
  }
}

export const SerializationPublicApi: NajsEloquent.Model.IModelSerialization = {
  getVisible(this: Model) {
    return this.driver.getSerializationFeature().getVisible(this)
  },

  setVisible(this: Model, visible: string[]) {
    this.driver.getSerializationFeature().setVisible(this, visible)
    return this
  },

  addVisible(this: Model) {
    this.driver.getSerializationFeature().addVisible(this, arguments)
    return this
  },

  makeVisible(this: Model) {
    this.driver.getSerializationFeature().makeVisible(this, arguments)
    return this
  },

  isVisible(this: Model) {
    return this.driver.getSerializationFeature().isVisible(this, arguments)
  },

  getHidden(this: Model) {
    return this.driver.getSerializationFeature().getHidden(this)
  },

  setHidden(this: Model, hidden: string[]) {
    this.driver.getSerializationFeature().setHidden(this, hidden)
    return this
  },

  addHidden(this: Model) {
    this.driver.getSerializationFeature().addHidden(this, arguments)

    return this
  },

  makeHidden(this: Model) {
    this.driver.getSerializationFeature().makeHidden(this, arguments)
    return this
  },

  isHidden(this: Model) {
    return this.driver.getSerializationFeature().isHidden(this, arguments)
  },

  attributesToObject<T extends object = object>(this: Model): T {
    return this.driver.getSerializationFeature().attributesToObject(this) as T
  },

  relationsToObject<T extends object = object>(this: Model): T {
    const args = parse_relationsToObject_arguments(arguments)
    return this.driver.getSerializationFeature().relationsToObject(this, args.relations, args.formatName) as T
  },

  toObject<T extends object = object>(this: Model, options?: object): T {
    return this.driver.getSerializationFeature().toObject(this, options) as T
  },

  toJSON<T extends object = object>(this: Model, options?: object): T {
    return this.driver.getSerializationFeature().toObject(this, options) as T
  },

  toJson(this: Model, replacer?: (key: string, value: any) => any, space?: string | number): string {
    return this.driver.getSerializationFeature().toJson(this, replacer, space)
  }
}
