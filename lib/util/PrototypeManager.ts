export const PrototypeManager = {
  stopFindingRelationsPrototypes: [Object.prototype],

  stopFindingRelationsIn(prototype: object) {
    if (this.shouldFindRelationsIn(prototype)) {
      this.stopFindingRelationsPrototypes.push(prototype)
    }
  },

  shouldFindRelationsIn(prototype: object): boolean {
    for (const item of this.stopFindingRelationsPrototypes) {
      if (item === prototype) {
        return false
      }
    }
    return true
  }
}
