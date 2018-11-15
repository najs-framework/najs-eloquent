/// <reference path="../../definitions/model/IModel.ts" />
/// <reference path="../../definitions/model/IModelFillable.ts" />
import Model = NajsEloquent.Model.ModelInternal

export const FillablePublicApi: NajsEloquent.Model.IModelFillable = {
  getFillable(this: Model) {
    return this.driver.getFillableFeature().getFillable(this)
  },

  setFillable(this: Model, fillable: string[]) {
    this.driver.getFillableFeature().setFillable(this, fillable)
    return this
  },

  getGuarded(this: Model) {
    return this.driver.getFillableFeature().getGuarded(this)
  },

  setGuarded(this: Model, guarded: string[]) {
    this.driver.getFillableFeature().setGuarded(this, guarded)
    return this
  },

  isFillable(this: Model) {
    return this.driver.getFillableFeature().isFillable(this, arguments)
  },

  addFillable(this: Model) {
    this.driver.getFillableFeature().addFillable(this, arguments)

    return this
  },

  addGuarded(this: Model) {
    this.driver.getFillableFeature().addGuarded(this, arguments)

    return this
  },

  isGuarded(this: Model) {
    return this.driver.getFillableFeature().isGuarded(this, arguments)
  },

  fill(this: Model, data: object) {
    this.driver.getFillableFeature().fill(this, data)

    return this
  },

  forceFill(this: Model, data: object) {
    this.driver.getFillableFeature().forceFill(this, data)

    return this
  }
}
