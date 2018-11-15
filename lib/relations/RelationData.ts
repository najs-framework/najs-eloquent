/// <reference path="../definitions/relations/IRelationData.ts" />

export class RelationData<T> implements NajsEloquent.Relation.IRelationData<T> {
  protected data: T | undefined | null
  protected state: string
  protected factory: NajsEloquent.Relation.IRelationshipFactory
  protected loadType?: 'lazy' | 'eager'

  constructor(factory: NajsEloquent.Relation.IRelationshipFactory) {
    this.factory = factory
    this.state = 'unload'
  }

  getFactory(): NajsEloquent.Relation.IRelationshipFactory {
    return this.factory
  }

  isLoaded(): boolean {
    return this.state === 'loaded' || this.state === 'collected'
  }

  hasData(): boolean {
    return this.state === 'collected'
  }

  getData(): T | undefined | null {
    return this.data
  }

  setData(data: T | undefined | null): T | undefined | null {
    this.data = data
    this.state = 'collected'

    return data
  }

  getLoadType(): 'unknown' | 'lazy' | 'eager' {
    return this.loadType || 'unknown'
  }

  setLoadType(type: 'lazy' | 'eager'): this {
    this.loadType = type
    this.state = 'loaded'

    return this
  }
}
